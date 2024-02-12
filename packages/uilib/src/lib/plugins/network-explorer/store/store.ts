import type { Edge, Node as FlowNodes } from "@xyflow/svelte"
import { writable, get } from "svelte/store"
import { extractIEDs, findAllIEDBays, type IED } from "../diagram/networking"
import { type Config, generateElkJSLayout } from "../diagram/elkjs-layout-generator"
import { convertElKJSRootNodeToSvelteFlowObjects } from "../diagram/elkjs-svelteflow-converter"
import { getIedNameFromId, hasOpenPort } from "../diagram/ied-helper"
import { isBayNode } from "../../../components/diagram"
import type { BayElkNode, IEDElkNode } from "../../../components/diagram"


export class DiagramStore {
	public nodes = writable<FlowNodes[]>([])
	public edges = writable<Edge[]>([])
	public ieds = writable<IED[]>([])
	
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
		this.setIsConnectedable(resp.nodes)
		
		this.nodes.set(resp.nodes)
		this.edges.set(resp.edges)
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

	private setIsConnectedable(nodes: FlowNodes[]): void {
		for (const node of nodes) {
			if (this.isNodeConnectable(node as unknown as IEDElkNode | BayElkNode)) {
				node.connectable = true
			}
		}
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
