import ELK, { type ElkNode } from "elkjs/lib/elk.bundled"
import type { BayElkNode, IEDConnection, IEDElkNode, NetworkNode, RootNode } from "../../../components/diagram"
import {type BayIEDNameMap, createCableNetowrkingMap, type IED } from "./networking"
// import type { IEDBayMap } from "./ied-network-info"
import { createCableId } from "./edge-helper"
import { Networking } from "@oscd-plugins/core"

const defaultConfigs: Partial<Config> = {
	spacingBase:          0,
	spacingBetweenLayers: 0,
}

export type Config = {
	width: number,
	height: number,
	spacingBase?: number,
	spacingBetweenLayers?: number,
	// heightPerConnection: number,
}

export async function generateElkJSLayout(
	ieds: IED[],
	bayIedMap: BayIEDNameMap,
	customConfig: Config,
): Promise<RootNode<NetworkNode>> {

	const config: Config = {
		...defaultConfigs,
		...customConfig,
	}
	
	const bayElkNodes: BayElkNode[] = Object.keys(bayIedMap).map(bayName => createBayElkNode(bayName, config))
	const iedElkNodes: IEDElkNode[] = ieds.map(ied =>  createIEDElkNode(ied.name, config))

	const iedsWithoutBay: IEDElkNode[] = []
	iedElkNodes.forEach(iedNode => assignNodeToBay(iedNode, bayIedMap, bayElkNodes, iedsWithoutBay) )
	
	const cableNetworkingMap = createCableNetowrkingMap(ieds)
	const networkingPairs = Object
		.values(cableNetworkingMap)
		.filter(function isAnExectPair(networkingList) { return networkingList.length === 2 })

	const edges = networkingPairs.map(createEdge)

	return await createLayoutWithElk(config, bayElkNodes, iedsWithoutBay, edges)
	
}


// Need more configuration options of elk.js?
// 👉 https://www.eclipse.org/elk/reference/algorithms.html 
async function createLayoutWithElk(
	config: Config, 
	bayNodes: BayElkNode[], 
	iedsWithoutBay: IEDElkNode[], 
	edges: IEDConnection[],
) {
	const elk = new ELK()
	const graph: ElkNode = {
		id:            "graph-root",
		layoutOptions: {
			"elk.algorithm":                     "org.eclipse.elk.layered",
			"hierarchyHandling":                 "INCLUDE_CHILDREN",
			// "elk.algorithm": "org.eclipse.elk.stress",
			// "elk.algorithm":             "org.eclipse.elk.force",
			// "org.eclipse.elk.layered.unnecessaryBendpoints": "true",
			// "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "RIGHTUP",
			// "org.eclipse.elk.direction": "LEFT",
			"org.eclipse.elk.direction":         "RIGHT",
			"org.eclipse.elk.spacing.labelNode": "20",

			// default: 20; a component is when multiple nodes are connected
			// "org.eclipse.elk.spacing.componentComponent": "20", 
			// "org.eclipse.elk.hierarchyHandling":  "INCLUDE_CHILDREN",
			// "org.eclipse.elk.layered.mergeEdges": "false",
			// "org.eclipse.elk.stress.desiredEdgeLength":              "200.0",
			"org.eclipse.elk.layered.spacing.baseValue":                 String(config.spacingBase),
			"org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers":     String(config.spacingBetweenLayers),
			"org.eclipse.elk.layered.layering.strategy":                 "LONGEST_PATH",
			"org.eclipse.elk.layered.layering.coffmanGraham.layerBound": "100",
			"org.eclipse.elk.layered.nodePlacement.strategy":            "BRANDES_KOEPF",
		},
		children: [...bayNodes, ...iedsWithoutBay],
		edges,
	}

	const nodes = (await elk.layout(graph)) as RootNode

	return nodes
}

function createEdge(networkingList: Networking[]) {
	const id = createCableId(networkingList[0].cable)
	return {
		id:      id,
		sources: [`ied-${networkingList[0].iedName}`],
		targets: [`ied-${networkingList[1].iedName}`],
		type:    "floating",
	}
}

function assignNodeToBay(
	iedNode: IEDElkNode,
	iedBayMap: BayIEDNameMap,
	bayNodes: BayElkNode[],
	iedsWithoutBay: IEDElkNode[],
) {
	const bayName = Object.keys(iedBayMap).find(bayName => iedBayMap[bayName].includes(iedNode.label))
	const belongsToBay = Boolean(bayName)
	if(!belongsToBay){
		iedsWithoutBay.push(iedNode)
		return
	}

	const bayNode = bayNodes.find(bayNode => bayNode.id === `bay-${bayName}`)
	if(!bayNode){
		console.warn({level: "warn", msg: "assignNodeToBay; no baynode found", bayName })
		return
	}

	iedNode.layoutOptions = {
		"org.eclipse.elk.direction": "LEFT",
	}
	bayNode.children.push(iedNode)

}


function createBayElkNode(bayName: string, config: Config): BayElkNode {
	return {
		id:            `bay-${bayName}`,
		label:         bayName,
		// width:         config.width,
		// height:        config.height,
		isBayNode:     true,
		children:      [],
		layoutOptions: {
			"spacing.baseValue":             String(config.spacingBase),
			"spacing.nodeNodeBetweenLayers": String(config.spacingBetweenLayers),
			"elk.padding":                   "[top=20.0,left=20.0,bottom=20.0]",
		},
	}
}

function createIEDElkNode(iedName: string, config: Config): IEDElkNode {
	return {
		id:     `ied-${iedName}`,
		label:  iedName,
		labels: [
			{
				text: iedName,
			},
		],
		isBayNode:  false,
		isRelevant: true,
		width:      config.width,
		height:     config.height,
		children:   [],
	}
}