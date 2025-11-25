import type { Edge, Node as FlowNodes } from "@xyflow/svelte"
import { writable, get } from "svelte/store"
import { extractIEDs, findAllIEDBays, type IED } from "../diagram/networking"
import { type Config, generateElkJSLayout } from "../diagram/elkjs-layout-generator"
import { convertElKJSRootNodeToSvelteFlowObjects } from "../diagram/elkjs-svelteflow-converter"
import { getIedNameFromId, hasOpenPort } from "../diagram/ied-helper"
import { isBayNode } from "../external/diagram"
import type { BayElkNode, IEDElkNode } from "../external/diagram"
import { extractCableNameFromId } from "../diagram/edge-helper"


export class DiagramStore {
	public nodes: FlowNodes[] = $state.raw([])
	public edges: Edge[] = $state.raw([])
	public ieds = writable<IED[]>([])
	public filterBayName: string | null = $state(null)
	
	public selectedNodes = writable<SelectedNode[]>([])

	public connectionBetweenNodes = writable<ConnectionBetweenNodes | null>(null)
	public async updateNodesAndEdges( root: Element ) {
		if (!root) {
			console.info({ level: "info", msg: "initInfos: no root" })
			return []
		}
		
		const ieds = extractIEDs(root)
		this.ieds.set(ieds)
		const iedBayMap = findAllIEDBays(root)
		const rootNode = await generateElkJSLayout(ieds, iedBayMap, config)

		const resp = convertElKJSRootNodeToSvelteFlowObjects(rootNode)

		// Apply bay filtering if filterBayName is set
		let filteredNodes = resp.nodes
		let filteredEdges = resp.edges
		
		if (this.filterBayName) {
			const filtered = this.filterForBay(this.filterBayName, resp.nodes, resp.edges, iedBayMap)
			filteredNodes = filtered.nodes
			filteredEdges = filtered.edges
		}

		const previousNodes = this.nodes
		const isNodeStructureEquivalent = this.isNodeStructureEquivalent(
			previousNodes as unknown as (IEDElkNode | BayElkNode)[],
			filteredNodes as unknown as (IEDElkNode | BayElkNode)[],
		)

		const shouldRerenderNodes = !isNodeStructureEquivalent
		if (shouldRerenderNodes) {
			this.nodes = filteredNodes
		}
		this.edges = filteredEdges

		this.setIsConnectedable()
	}

	public updateSelectedNodes(flowNodes: FlowNodes[]){
		this.resetNewConnection()
		const selectedNodes = flowNodes.filter(n => n.selected)
		
		const isSelectionReset = selectedNodes.length === 0
		if(isSelectionReset){
			this.selectedNodes.set([])	
			return
		}

		const ieds = get(this.ieds)
		const selectedIEDs = selectedNodes
			.map( node => ieds.find(ied => ied.name === node.data.label) )
			.filter(Boolean) as IED[]

		this.selectedNodes.set(selectedIEDs)
	}

	public updateSelectedEdges(edges: Edge[]){
		const selectedEdges = edges.filter(e => e.selected)
		
		const isSelectionReset = selectedEdges.length === 0
		if(isSelectionReset){
			this.connectionBetweenNodes.set(null)
			return
		}


		const selectedEdge = selectedEdges[0]
		const sourceIedName = getIedNameFromId(selectedEdge.source)
		const targetIedName = getIedNameFromId(selectedEdge.target)

		const targetAndSource = get(this.ieds).filter(ied => ied.name === sourceIedName || ied.name === targetIedName)
		const sourceIed = targetAndSource.find(ied => ied.name === sourceIedName)
		const targetIed = targetAndSource.find(ied => ied.name === targetIedName)
	
		if (!sourceIed) {
			throw new Error(`Ied ${sourceIedName} not found`)
		}
	
		if (!targetIed) {
			throw new Error(`Ied ${targetIedName} not found`)
		}
	
		const cableName = extractCableNameFromId(selectedEdge.id)

		const newConnectionBetweenNodes: ConnectionBetweenNodes = {
			isNew:  false,
			source: sourceIed,
			target: targetIed,
			cableName,
		}
		this.connectionBetweenNodes.set(newConnectionBetweenNodes)
	}

	public findConnectedIEDs(ied: IED): IED[] {
		const ieds = get(this.ieds)

		const connectedIEDs = ieds.filter( otherIED => {
			if(ied === otherIED){ return false }

			const connected = ied.networking.some(iedNetworking => {
				return otherIED.networking.some(otherIEDNetworking => {
					return iedNetworking.cable === otherIEDNetworking.cable
				})
			})

			return connected
		})

		return connectedIEDs
	}

	public resetNewConnection(): void {
		this.connectionBetweenNodes.set(null)
	}

	public setFilterBay(bayName: string | null): void {
		this.filterBayName = bayName
	}

	private filterForBay(
		targetBayName: string,
		nodes: FlowNodes[],
		edges: Edge[],
		iedBayMap: ReturnType<typeof findAllIEDBays>
	): { nodes: FlowNodes[], edges: Edge[] } {
		// Get IEDs in the target bay
		const iedsInTargetBay = iedBayMap[targetBayName] || []
		const iedIdsInTargetBay = new Set(iedsInTargetBay.map(name => `ied-${name}`))

		// Find the target bay node
		const targetBayNode = nodes.find(n => n.id === `bay-${targetBayName}`)
		if (!targetBayNode) {
			console.warn(`Bay ${targetBayName} not found`)
			return { nodes: [], edges: [] }
		}

		// Get all IEDs connected to IEDs in the target bay
		const connectedIedIds = new Set<string>()
		for (const edge of edges) {
			const sourceInTargetBay = iedIdsInTargetBay.has(edge.source)
			const targetInTargetBay = iedIdsInTargetBay.has(edge.target)

			if (sourceInTargetBay) {
				connectedIedIds.add(edge.target)
			}
			if (targetInTargetBay) {
				connectedIedIds.add(edge.source)
			}
		}

		// Filter out IEDs that belong to other bays
		const filteredConnectedIedIds = new Set<string>()
		for (const iedId of connectedIedIds) {
			const iedName = getIedNameFromId(iedId)
			const belongsToOtherBay = Object.keys(iedBayMap).some(bayName => {
				return bayName !== targetBayName && iedBayMap[bayName].includes(iedName)
			})
			
			if (!belongsToOtherBay) {
				filteredConnectedIedIds.add(iedId)
			}
		}

		// Combine all allowed IED IDs
		const allowedIedIds = new Set([...iedIdsInTargetBay, ...filteredConnectedIedIds])

		// Filter nodes: include target bay and allowed IEDs
		const filteredNodes = nodes.filter(node => {
			if (node.id === `bay-${targetBayName}`) {
				return true
			}
			return allowedIedIds.has(node.id)
		})

		// Filter edges: only include edges between allowed IEDs
		const filteredEdges = edges.filter(edge => {
			return allowedIedIds.has(edge.source) && allowedIedIds.has(edge.target)
		})

		return { nodes: filteredNodes, edges: filteredEdges }
	}

	private isNodeStructureEquivalent(previousNodes: (IEDElkNode | BayElkNode)[], nodes: (IEDElkNode | BayElkNode)[]): boolean {
		const previousIEDNodes = previousNodes.filter(n => !isBayNode(n))
		const IEDNodes = nodes.filter(n => !isBayNode(n))
		const isIEDStructureEquivalent = this.isIEDStructureEquivalent(previousIEDNodes, IEDNodes)

		const previousBayNodes = previousNodes.filter(n => isBayNode(n)) as BayElkNode[]
		const bayNodes = nodes.filter(n => isBayNode(n)) as BayElkNode[]
		const isBayStructureEquivalent = this.isBayStructureEquivalent(previousBayNodes, bayNodes)

		return isIEDStructureEquivalent && isBayStructureEquivalent
	}

	private isIEDStructureEquivalent(previousIEDs: IEDElkNode[], IEDs: IEDElkNode[]): boolean {
		const hasSameAmountOfIEDs = previousIEDs.length === IEDs.length
		if (!hasSameAmountOfIEDs) {
			return false
		}

		const IEDNodeSet = new Set(IEDs.map(n => n.id))
		return previousIEDs.every(n => IEDNodeSet.has(n.id))
	}

	private isBayStructureEquivalent(previousBays: BayElkNode[], bays: BayElkNode[]): boolean {
		const hasSameAmountOfBays = previousBays.length === bays.length

		if (!hasSameAmountOfBays) {
			return false
		}

		const bayChildrenMap = new Map(bays.map(b => [b.id, new Set(b.children.map(c => c.id))]))

		return previousBays.every(bay => {
			const children = bayChildrenMap.get(bay.id)
			return children && bay.children.every(c => children.has(c.id))
		})
	}

	private setIsConnectedable(): void {
		this.nodes = this.nodes.map(n => ({
			...n,
			connectable: true
		}))
	}

	private isNodeConnectable(node: IEDElkNode | BayElkNode): boolean {
		if (isBayNode(node)) {
			return false
		}

		const iedName = getIedNameFromId(node.id)
		const ieds = get(this.ieds)
		const ied = ieds.find(ied => ied.name === iedName)

		if (!ied) {
			throw new Error(`IED ${iedName} not found`)
		}

		return hasOpenPort(ied)
	}
	
}

export type SelectedNode = IED

export type ConnectionBetweenNodes = {
	isNew: boolean,
	cableName?: string,
	source: IED,
	target: IED,
}

export const buildCablePortId = (cable: string, port: string): string => `${cable}-${port}`

const config: Config = {
	width: 	200,
	height: 30,

	spacingBase:          10,
	spacingBetweenLayers: 100,
}
