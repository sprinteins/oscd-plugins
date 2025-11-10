import type { Edge, Node} from "@xyflow/svelte"
import type { IEDConnectionWithCustomValues, NetworkNode, RootNode } from "../../../components/diagram"
import { Position } from "@xyflow/svelte"


/**
 * Converts an ELKJS RootNode to SvelteFlow Nodes and Edges
 * There are a few differences between the objects like 
 * how the position is stored. 
 * For details, see the `convertNetworkNode` function
 * 
 * Another difference is that an ELKJS Edge can list multiple sources and targets
 * and SvelteFlow only allows one source and one target.
 * For details, see the `convertEdge` function
 * 
 * 
 * @param rootNode 
 * @returns 
 */
export function convertElKJSRootNodeToSvelteFlowObjects(rootNode: RootNode<NetworkNode>): {edges: Edge[], nodes: Node[]}{

	if(!rootNode.children){ return nullResponse}
	if(rootNode.children.length === 0){ return nullResponse}
	
	// Convert Nodes
	const parentNodes: Node[] = rootNode.children.map(convertNetworkNode) 

	const childrenNodes = parentNodes
		.map( (node: Node) => node.children.map((childNode: Node) => {
			return {
				...convertNetworkNode(childNode),
				parentId: node.id,
			}
		}))
		.flat()

	const nodes = [...parentNodes, ...childrenNodes]

	// Convert Edges
	const edges: Edge[] = rootNode.edges?.map(convertEdge) ?? []

	return {
		nodes,
		edges,
	}
}

const nullResponse = {
	nodes: [],
	edges: [],
}

function convertNetworkNode(node: NetworkNode): Node {
	return {
		...node,
		position: {
			x: node.x??0,
			y: node.y??0,
		},
		data: {
			label: node.label,
		},
		type:           node.isBayNode? "bay" : "ied",
		style:          `width: ${node.width}px; height: ${node.height}px;`,
		targetPosition: Position.Top,
		sourcePosition: Position.Bottom,
	} satisfies Node
}

function convertEdge(edge: IEDConnectionWithCustomValues): Edge {
	return {
		id:     edge.id,
		source: edge.sources[0],
		target: edge.targets[0],
		// type:   "smoothstep",
		// type:   "step",
		// type:   "straight",
		type:   "bezier",
		// style:  "stroke: black;",
		// animated: true,
	}
}