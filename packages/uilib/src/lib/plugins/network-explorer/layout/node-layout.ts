import ELK, { type ElkNode } from "elkjs/lib/elk.bundled"
import type { IEDNetworkInfo, IEDNetworkInfoV3 } from "@oscd-plugins/core"
import { newIEDNode, type BayNode, type IEDConnection, type IEDNode, type RootNode, type SubnetworkEdge } from "../../../components/diagram"

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
	customConfig: Config,
// ): Promise<RootNode> {
) {

	const config: Config = {
		...defaultConfigs,
		...customConfig,
	}

	const cableList = createCableList(iedNetworkInfos)
	const cablePairs = cableList.filter(cable => cable.ieds.length === 2)
	const ipMap = createIPMap(iedNetworkInfos)
	const iedsWithDuplicates = cablePairs
		.map(cable => cable.ieds)
		.flat()
	const ieds = [...new Set(iedsWithDuplicates)] // deduping
	
	// 
	// NODDES
	// 
	
	
	// const children: IEDNode[] = []

	const children = ieds.map(ied => {
		const newNode =  newIEDNode({
			id:         `ied-${ied.iedName}`,
			label:      ied.iedName,
			isRelevant: true,
			width:      config.width,
			height:     config.height,
			
		})
		return newNode
	})

	// const edgesWithDuplicates = cablePairs.map(cable => {
	const edges = cablePairs.map(cable => {
		const edge = {
			// we use random uuids, becase sometimes there are multiple cables 
			// between the same two ieds
			id:      crypto.randomUUID(),
			// id:      `${cable.ieds[0].iedName}__${cable.ieds[1].iedName}`,
			sources: [`ied-${cable.ieds[0].iedName}`],
			targets: [`ied-${cable.ieds[1].iedName}`],
			type:    "floating",
		}
		// console.log(edge, cable.ieds.map(ied => ied.iedName).join(" + ") )

		return edge
	})

	// For debugging
	// const edgeIds = edges.map(edge => edge.id).sort()
	// const dedupedEdgeIds = [...new Set(edgeIds)].sort()
	// const difference = edgeIds.filter(x => !dedupedEdgeIds.includes(x))
	

	console.log({level: "dev", msg: "calculateLayoutV2", cablePairs, ipMap, ieds, edges, children})	

	const elk = new ELK()

	// Need more configuration options of elk.js?
	// 👉 https://www.eclipse.org/elk/reference/algorithms.html 
	const graph: ElkNode = {
		id:            "graph-root",
		layoutOptions: {
			"elk.algorithm":             "org.eclipse.elk.layered",
			// "elk.algorithm": "org.eclipse.elk.stress",
			// "elk.algorithm":             "org.eclipse.elk.force",
			// "org.eclipse.elk.layered.unnecessaryBendpoints": "true",
			// "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "RIGHTUP",
			"org.eclipse.elk.direction": "LEFT",
			
			// default: 20; a component is when multiple nodes are connected
			// "org.eclipse.elk.spacing.componentComponent": "20", 

			// "org.eclipse.elk.hierarchyHandling":  "INCLUDE_CHILDREN",
			// "org.eclipse.elk.layered.mergeEdges": "false",
			// "org.eclipse.elk.stress.desiredEdgeLength":              "200.0",
			"org.eclipse.elk.layered.spacing.baseValue":             String(defaultConfigs.spacingBase),
			"org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": String(defaultConfigs.spacingBetweenNodes),
		},
		children,
		edges,
	}

	const nodes = (await elk.layout(graph)) as RootNode

	return nodes

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

type IPMap = {[ip: string]: IEDNetworkInfoV3}
function createIPMap(iedNetworkInfos: IEDNetworkInfoV3[]): IPMap {
	const ipMap: IPMap = {}
	for(const iedNetworkInfo of iedNetworkInfos) {
		const ip = iedNetworkInfo.networkInfo.ip
		ipMap[ip] = iedNetworkInfo
	}

	return ipMap
}

function generateBayNodes(iedsByBay: Map<string, IEDNetworkInfo[]>): BayNode[] {
	const nodes: BayNode[] = []

	for (const [bay, ieds] of iedsByBay.entries()) {
		const children = ieds.map((ied) => ({
			id:         `ied-${ied.iedName}`,
			label:      ied.iedName,
			isRelevant: true,
			width:      100,
			height:     30,
		}))

		nodes.push({
			id:        `bay-${bay}`,
			isBayNode: true,
			label:     bay,
			width:     600,
			height:    300,
			children,
		})
	}

	return nodes
}

function generateSubnetworks(ieds: IEDNetworkInfo[]): IEDNode[] {
	const subnetworkNames = ieds.map(ied => ied.subneworkConnections.map(sc => sc.subnetwork))
		.flat()

	const uniqueSubnetworks = [...new Set(subnetworkNames)]

	const subnetworkNodes: IEDNode[] = uniqueSubnetworks.map(subnetworkName => ({
		id:         `subnetwork-${subnetworkName}`,
		label:      subnetworkName,
		isRelevant: true,
		width:      200,
		height:     50,
	}))

	subnetworkNodes.forEach(node => {
		const edges = generateSubnetworkConnections(node, ieds)
		node.edges = edges
	})

	return subnetworkNodes
}

function generateSubnetworkConnections(subnetwork: IEDNode, ieds: IEDNetworkInfo[]): IEDConnection[] {
	const connections: IEDConnection[] = []

	const connectedIeds = ieds.filter(ied => ied.subneworkConnections.some(sc => sc.subnetwork === subnetwork.label))

	for (const connectedIed of connectedIeds) {
		connections.push({
			id:         `con_subnetwork_${subnetwork.label}-${connectedIed.iedName}`,
			isRelevant: true,
			targets:    [ subnetwork.id ],
			sources:    [ `ied-${connectedIed.iedName}` ],
		})
	}

	return connections
}

export async function calculateLayout(
	iedsByBay: Map<string, IEDNetworkInfo[]>, 
): Promise<RootNode> {
	const bayNodes: BayNode[] = generateBayNodes(iedsByBay)
	const allIeds = Array.from(iedsByBay.values()).flat()
	const subnetworkNodes = generateSubnetworks(allIeds)

	const edges: IEDConnection[] = subnetworkNodes
		.filter(node => node.edges !== undefined)
		.map(node => node.edges)
		.flat() as IEDConnection[]
	console.log(edges)

	const children = [...bayNodes, ...subnetworkNodes]

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

			"org.eclipse.elk.hierarchyHandling":  "INCLUDE_CHILDREN",
			"org.eclipse.elk.layered.mergeEdges": "true",
			
			"org.eclipse.elk.layered.spacing.baseValue":             String(defaultConfigs.spacingBase),
			"org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": String(defaultConfigs.spacingBetweenNodes),
		},
		children,
		edges,
	}

	// message type information gets lost here
	const nodes = (await elk.layout(graph)) as RootNode

	return nodes
}
