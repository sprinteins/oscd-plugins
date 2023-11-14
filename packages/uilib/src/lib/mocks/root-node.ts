import ELK, { type ElkNode } from "elkjs/lib/elk.bundled"
import type { IEDConnection, IEDConnectionWithCustomValues, IEDNode, RootNode } from "../components/diagram"

const config = {
	width:  100,
	height: 30,
}


export async function generateMockRootNode(): Promise<RootNode>{

	let id=-1
	function ID(){
		id++
		return String(id)
	}
	
	function Label(prefix = "IED "){
		return prefix + String(id)
	}
	
	const children: IEDNode[] = [
		{id: ID(), width: config.width, height: config.height, label: Label()},
		{id: ID(), width: config.width, height: config.height, label: Label()},
		{id: ID(), width: config.width, height: config.height, label: Label()},
		{id: ID(), width: config.width, height: config.height, label: Label()},
	
	]
	
	let edgeId=0
	function EdgeID(){
		return String(edgeId++)
	}
	
	const edges: IEDConnectionWithCustomValues[] = [

		{
			id:        EdgeID(), 
			sources:   [children[0].id], 
			targets:   [children[1].id], 
			sourceIED: {iedName: children[0].label, published: [], received: []},
			targetIED: {iedName: children[1].label, published: [], received: []},
		},
		{
			id:        EdgeID(), 
			sourceIED: {iedName: children[1].label, published: [], received: []},
			targetIED: {iedName: children[2].label, published: [], received: []},
			sources:   [children[0].id], 
			targets:   [children[1].id],
		},

		
	]

	children.forEach( (_, index ) => children[index].isRelevant = true )
	edges.forEach( (_, index ) => edges[index].isRelevant = true )
	
	const elk = new ELK()
	
	// https://www.eclipse.org/elk/reference/algorithms.html
	const graph: ElkNode = {
		id:            "graph-root",
		layoutOptions: {
			"elk.algorithm":                                           "org.eclipse.elk.layered",
			"org.eclipse.elk.direction":                               "UP",
			"org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "LEFTDOWN",
		},
		children,
		edges,
	}
	
	return elk.layout(graph) as Promise<RootNode>
}
