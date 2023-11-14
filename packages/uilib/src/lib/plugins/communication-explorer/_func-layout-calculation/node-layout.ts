import ELK, { type ElkNode } from "elkjs/lib/elk.bundled"
import type { IEDCommInfo } from "@oscd-plugins/core"
import type { SelectedFilter } from "../_store-view-filter"
import { generateConnectionLayout } from "."
import type { IEDNode, RootNode } from "../../../components/diagram"
import { generateIEDLayout } from "./node-layout-ieds"
import type { Config } from "./config"
import type { Preferences } from "../_store-preferences"


const defaultConfigs: Partial<Config> = {
	spacingBase:         20,
	spacingBetweenNodes: 20,
}

export async function calculateLayout(
	ieds: IEDCommInfo[], 
	config: Config, 
	selectionFilter: SelectedFilter,
	preferences: Preferences,
): Promise<RootNode> {

	config = {
		...defaultConfigs,
		...config,
	}
		
	if(selectionFilter.nameFilter !== ""){
		ieds = ieds.filter(ied => ied.iedName.toLowerCase().includes(selectionFilter.nameFilter.toLowerCase()))
	}

	let edges = generateConnectionLayout(ieds, selectionFilter)
	let children: IEDNode[] = generateIEDLayout(ieds, edges, config)

	if(preferences.isFocusModeOn){
		children = children.filter(child => child.isRelevant)
		edges = edges.filter(edge => edge.isRelevant)
	}

	const elk = new ELK()

	// Need more configuration options of elk.js?
	// 👉 https://www.eclipse.org/elk/reference/algorithms.html 
	const graph: ElkNode = {
		id:            "graph-root",
		layoutOptions: {
			"elk.algorithm":                                           "org.eclipse.elk.layered",
			"org.eclipse.elk.layered.unnecessaryBendpoints":           "true",
			"org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "RIGHTUP",
			"org.eclipse.elk.direction":                               "LEFT",
			
			// default: 20; a component is when multiple nodes are connected
			// "org.eclipse.elk.spacing.componentComponent": "20", 
			
			"org.eclipse.elk.layered.spacing.baseValue":             String(config.spacingBase),
			"org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": String(config.spacingBetweenNodes),
			
		},
		children,
		edges,
	}

	// message type information gets lost here
	const nodes = (await elk.layout(graph)) as RootNode

	return nodes
}
