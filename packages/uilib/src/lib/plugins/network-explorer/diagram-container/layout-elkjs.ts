import type { IEDNetworkInfo, IEDNetworkInfoV3 } from "@oscd-plugins/core"
import ELK, { type ElkNode } from "elkjs/lib/elk.bundled"
import type { BayNode, IEDConnection, IEDNode, NetworkNode, RootNode } from "../../../components/diagram"
import type { IEDBayMap } from "./ied-network-info"

const defaultConfigs: Partial<Config> = {
	spacingBase:         0,
	spacingBetweenNodes: 0,
}

export type Config = {
	width: number,
	height: number,
	spacingBase?: number,
	spacingBetweenNodes?: number,
	// heightPerConnection: number,
}

export async function calculateLayoutV2(
	iedNetworkInfos: IEDNetworkInfoV3[],
	iedBayMap: IEDBayMap,
	customConfig: Config,
): Promise<RootNode<NetworkNode>> {

	const config: Config = {
		...defaultConfigs,
		...customConfig,
	}
	const cableList = createCableList(iedNetworkInfos)
	const cablePairs = cableList.filter(function isAnExectPair(cable) { return cable.ieds.length === 2 })
	const iedsWithDuplicates = cablePairs
		.map(cable => cable.ieds)
		.flat()
	const ieds = [...new Set(iedsWithDuplicates)] // deduping
	
	const bayNodes: BayNode[] = Object.keys(iedBayMap).map(bayName => createBayNode(bayName, config))
	const iedNodes: IEDNode[] = ieds.map(ied => createIEDNode(ied, config))

	const iedsWithoutBay: IEDNode[] = []
	iedNodes.forEach(iedNode => assignNodeToBay(iedNode, iedBayMap, bayNodes, iedsWithoutBay) )
	
	const edges = cablePairs.map(createEdge)
	
	return await createLayoutWithElk(config, bayNodes, iedsWithoutBay, edges)
	
}

// Need more configuration options of elk.js?
// 👉 https://www.eclipse.org/elk/reference/algorithms.html 
async function createLayoutWithElk(
	config: Config, 
	bayNodes: BayNode[], 
	iedsWithoutBay: IEDNode[], 
	edges: IEDConnection[],
) {
	const elk = new ELK()
	const graph: ElkNode = {
		id:            "graph-root",
		layoutOptions: {
			"elk.algorithm":             "org.eclipse.elk.layered",
			"hierarchyHandling":         "INCLUDE_CHILDREN",
			// "elk.algorithm": "org.eclipse.elk.stress",
			// "elk.algorithm":             "org.eclipse.elk.force",
			// "org.eclipse.elk.layered.unnecessaryBendpoints": "true",
			// "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "RIGHTUP",
			// "org.eclipse.elk.direction": "LEFT",
			"org.eclipse.elk.direction": "BOTTOM",

			// default: 20; a component is when multiple nodes are connected
			// "org.eclipse.elk.spacing.componentComponent": "20", 
			// "org.eclipse.elk.hierarchyHandling":  "INCLUDE_CHILDREN",
			// "org.eclipse.elk.layered.mergeEdges": "false",
			// "org.eclipse.elk.stress.desiredEdgeLength":              "200.0",
			"org.eclipse.elk.layered.spacing.baseValue":             String(config.spacingBase),
			"org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": String(config.spacingBetweenNodes),
		},
		children: [...bayNodes, ...iedsWithoutBay],
		edges,
	}

	const nodes = (await elk.layout(graph)) as RootNode

	return nodes
}

function createEdge(cable: { label: string; ieds: IEDNetworkInfoV3[] }) {
	return {
		id:      crypto.randomUUID(),
		sources: [`ied-${cable.ieds[0].iedName}`],
		targets: [`ied-${cable.ieds[1].iedName}`],
		type:    "floating",
	}
}

function assignNodeToBay(
	iedNode: IEDNode,
	iedBayMap: IEDBayMap,
	bayNodes: BayNode[],
	iedsWithoutBay: IEDNode[],
) {
	const bayName = Object.keys(iedBayMap).find(bayName => iedBayMap[bayName].includes(iedNode.label))
	const belongsToBay = Boolean(bayName)
	if(!belongsToBay){
		iedsWithoutBay.push(iedNode)
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



type CableMap = {[cable: string]: IEDNetworkInfoV3[]}
type CableList = {label: string, ieds: IEDNetworkInfoV3[]}[]

function createCableList(iedNetworkInfos: IEDNetworkInfoV3[]): CableList {
	const cableMap: CableMap = {}
	for(const iedNetworkInfo of iedNetworkInfos) {
		for(const cable of iedNetworkInfo.networkInfo.cables){
			if(!cableMap[cable]) {
				cableMap[cable] = []
			}
			cableMap[cable].push(iedNetworkInfo)
		}
	}

	const cableList: CableList = Object
		.keys(cableMap)
		.map(cable => ({label: cable, ieds: cableMap[cable]}))

	return cableList
}

function createBayNode(bayName: string, config: Config): BayNode {
	return {
		id:            `bay-${bayName}`,
		label:         bayName,
		width:         config.width,
		height:        config.height + 200,
		isBayNode:     true,
		children:      [],
		layoutOptions: {
			"spacing.baseValue":             String(config.spacingBase),
			"spacing.nodeNodeBetweenLayers": String(config.spacingBetweenNodes),
		},
	}
}

function createIEDNode(ied: IEDNetworkInfoV3, config: Config): IEDNode {
	return {
		id:         `ied-${ied.iedName}`,
		label:      ied.iedName,
		isBayNode:  false,
		isRelevant: true,
		width:      config.width,
		height:     config.height,
		children:   [],
	}
}