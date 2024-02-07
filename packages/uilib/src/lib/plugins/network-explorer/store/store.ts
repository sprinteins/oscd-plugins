import type { Edge, Node as FlowNodes } from "@xyflow/svelte"
import { writable } from "svelte/store"
import { extractIEDs, findAllIEDBays, type IED } from "../diagram/networking"
import { type Config, generateElkJSLayout } from "../diagram/elkjs-layout-generator"
import { convertElKJSRootNodeToSvelteFlowObjects } from "../diagram/elkjs-svelteflow-converter"


export class DiagramStore {
	public nodes = writable<FlowNodes[]>([])
	public edges = writable<Edge[]>([])
	public ieds: IED[] = []
	
	public selectedNodes = writable<SelectedNode[]>([])
  
	public newConnectionBetweenNodes = writable<NewConnectionBetweenNodes | null>(null)

	public async updateNodesAndEdges( root: Element ) {
		if (!root) {
			console.info({ level: "info", msg: "initInfos: no root" })
			return []
		}
		
		
		this.ieds = extractIEDs(root)
		const iedBayMap = findAllIEDBays(root)
		const rootNode = await generateElkJSLayout(this.ieds, iedBayMap, config)

		const resp = convertElKJSRootNodeToSvelteFlowObjects(rootNode)
		this.nodes.set(resp.nodes)
		this.edges.set(resp.edges)
	}

	public updateSelectedNodes(flowNodes: FlowNodes[]){
		const selectedNodes = flowNodes.filter(n => n.selected)
		
		const isSelectionReset = selectedNodes.length === 0
		if(isSelectionReset){
			this.selectedNodes.set([])	
			return
		}

		const selectedIEDs = selectedNodes
			.map( node => this.ieds.find(ied => ied.name === node.data.label) )
			.filter(Boolean) as IED[]

		this.selectedNodes.set(selectedIEDs)
	}

	public findConnectedIEDs(ied: IED): IED[] {

		const connectedIEDs = this.ieds.filter( otherIED => {
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
		this.newConnectionBetweenNodes.set(null)
	}
	
}

export type SelectedNode = IED

export type NewConnectionBetweenNodes = {
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
