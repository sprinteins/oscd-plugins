import ELK from 'elkjs/lib/elk.bundled';
import { Position } from '@xyflow/svelte';
import type {
	Node,
	Edge
} from '@xyflow/svelte';
// STORES
import { diagramStore } from '../diagram.store.svelte';
// TYPES
import type {
	IEDNodeData,
	ConnectionData,
	CommunicationInfo
} from './types';

// Define a custom ElkFlowNode type that matches SvelteFlow Node type
interface ElkFlowNode extends Node {
	width?: number;
	height?: number;
	parent?: string;
}

interface LayoutConfig {
	iedWidth: number;
	iedHeight: number;
	bayLabelHeight: number;
	bayLabelGap: number;
	spacingBetweenNodes?: number;
	spacingBase?: number;
}

interface LayoutPreferences {
	playConnectionAnimation: boolean;
	showConnectionArrows: boolean;
	groupByBay: boolean;
	isFocusModeOn: boolean;
}

interface LayoutFilter {
	nameFilter: string;
	selectedTypes: Set<string>;
}

const defaultConfig: LayoutConfig = {
	iedWidth: 150,
	iedHeight: 40,
	bayLabelHeight: 15,
	bayLabelGap: 2,
	spacingBetweenNodes: 100,
	spacingBase: 40
};

const defaultPreferences: LayoutPreferences = {
	playConnectionAnimation: true,
	showConnectionArrows: true,
	groupByBay: true,
	isFocusModeOn: false
};

const defaultFilter: LayoutFilter = {
	nameFilter: '',
	selectedTypes: new Set()
};

/**
 * Generates SvelteFlow nodes and edges from IED communication info
 */
export async function generateDiagramLayout(
	iedInfos: CommunicationInfo[] = [],
	config: Partial<LayoutConfig> = {},
	preferences: Partial<LayoutPreferences> = {},
	filter: Partial<LayoutFilter> = {}
): Promise<{ nodes: Node[], edges: Edge[] }> {
	// Merge defaults with provided options
	const layoutConfig: LayoutConfig = { ...defaultConfig, ...config };
	const layoutPreferences: LayoutPreferences = { ...defaultPreferences, ...preferences };
	const layoutFilter: LayoutFilter = { ...defaultFilter, ...filter };

	// Get IED communication info and bays
	// const iedInfos = diagramStore.iedCommunicationInfos || [];
	// console.log(iedInfos);
	const allBays = diagramStore.bays;
	console.log(allBays);

	// Convert IED info to nodes and connections to edges
	const { nodes, edges } = generateNodesAndEdges(
		iedInfos,
		layoutConfig,
		layoutPreferences,
		layoutFilter
	);

	return { nodes, edges };

	// Apply ELK layout to the nodes and edges
	// return await applyElkLayout(nodes, edges, layoutConfig, layoutPreferences);
}

/**
 * Converts IED communication info to SvelteFlow nodes and edges
 */
function generateNodesAndEdges(
	iedInfos: CommunicationInfo[],
	config: LayoutConfig,
	preferences: LayoutPreferences,
	_filter: LayoutFilter
): { nodes: ElkFlowNode[], edges: Edge[] } {
	const nodes: ElkFlowNode[] = [];
	const edges: Edge[] = [];
	const iedMap = new Map<string, ElkFlowNode>();

	// Process IEDs and create nodes
	for (const ied of iedInfos) {
		// Create IED node
		const iedNode: ElkFlowNode = {
			id: `ied-${ied.iedName}`,
			type: 'iedNode', // Custom node type for rendering
			position: { x: 0, y: 0 }, // Initial position, will be updated by ELK
			data: {
				iedName: ied.iedName,
				bays: ied.bays,
				isRelevant: true,
				details: ied.iedDetails
			} as IEDNodeData,
			width: config.iedWidth,
			height: config.iedHeight
		};

		iedMap.set(ied.iedName, iedNode);
		nodes.push(iedNode);

		// Process connections (published and received messages)
		processConnections(ied, edges, preferences);
	}

	return { nodes, edges };
}

/**
 * Process IED connections to create edges
 */
function processConnections(
	ied: CommunicationInfo,
	edges: Edge[],
	preferences: LayoutPreferences
) {
	// Process published messages
	for (const message of ied.published) {
		if (!message.targetIEDName) continue;

		edges.push({
			id: `edge-${ied.iedName}-${message.targetIEDName}-${message.id}`,
			source: `ied-${ied.iedName}`,
			target: `ied-${message.targetIEDName}`,
			type: 'customEdge',
			animated: preferences.playConnectionAnimation,
			data: {
				sourceIEDName: ied.iedName,
				targetIEDName: message.targetIEDName,
				serviceType: message.serviceType,
				serviceCbName: message.serviceCbName,
				datSet: message.serviceDatSet,
				showLabel: true,
				isRelevant: true,
				animated: preferences.playConnectionAnimation
			} as ConnectionData
		});
	}

	// Process received messages
	for (const message of ied.received) {
		if (!message.iedName) continue;

		edges.push({
			id: `edge-${message.iedName}-${ied.iedName}-${message.srcCBName}`,
			source: `ied-${message.iedName}`,
			target: `ied-${ied.iedName}`,
			type: 'customEdge',
			animated: preferences.playConnectionAnimation,
			data: {
				sourceIEDName: message.iedName,
				targetIEDName: ied.iedName,
				serviceType: message.serviceType,
				serviceCbName: message.srcCBName,
				datSet: message.datSet,
				showLabel: true,
				isRelevant: true,
				animated: preferences.playConnectionAnimation
			} as ConnectionData
		});
	}
}

/**
 * Apply ELK layout to nodes and edges
 */
// async function applyElkLayout(
// 	nodes: ElkFlowNode[],
// 	edges: Edge[],
// 	config: LayoutConfig,
// 	preferences: LayoutPreferences
// ): Promise<{ nodes: Node[], edges: Edge[] }> {
// 	const elk = new ELK();

// 	const elkOptions = {
// 		'elk.algorithm': 'org.eclipse.elk.layered',
// 		'org.eclipse.elk.layered.unnecessaryBendpoints': 'true',
// 		'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'RIGHTUP',
// 		'elk.direction': 'LEFT',
// 		'elk.hierarchyHandling': preferences.groupByBay ? 'INCLUDE_CHILDREN' : 'SEPARATE_CHILDREN',
// 		'org.eclipse.elk.layered.spacing.baseValue': String(config.spacingBase || 40),
// 		'org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers': String(config.spacingBetweenNodes || 100),
// 	};

// 	const isHorizontal = elkOptions['elk.direction'] === 'RIGHT';

// 	// Convert nodes and edges to ELK format
// 	// Define a minimal interface for the ELK graph structure
// 	interface ElkGraphLayout {
// 		id: string;
// 		layoutOptions: Record<string, string>;
// 		children: Array<{
// 			id: string;
// 			width?: number;
// 			height?: number;
// 			targetPosition?: Position;
// 			sourcePosition?: Position;
// 			parent?: string;
// 		}>;
// 		edges: Array<{
// 			id: string;
// 			sources: string[];
// 			targets: string[];
// 		}>;
// 	}

// 	// Create the ELK graph structure
// 	const elkGraph: ElkGraphLayout = {
// 		id: 'root',
// 		layoutOptions: elkOptions,
// 		children: nodes.map(node => ({
// 			id: node.id,
// 			width: node.width,
// 			height: node.height,
// 			targetPosition: isHorizontal ? Position.Left : Position.Top,
// 			sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
// 			parent: node.parent
// 		})),
// 		edges: edges.map(edge => ({
// 			id: edge.id,
// 			sources: [edge.source],
// 			targets: [edge.target]
// 		}))
// 	};

// 	try {
// 		// Perform the layout calculation
// 		const layout = await elk.layout(elkGraph);

// 		// Map the layout back to SvelteFlow nodes
// 		const flowNodes = layout.children?.map(elkNode => {
// 			const original = nodes.find(n => n.id === elkNode.id);
// 			if (!original || !elkNode.x || !elkNode.y) return original;

// 			const flowNode: Node = {
// 				...original,
// 				position: {
// 					x: elkNode.x,
// 					y: elkNode.y
// 				}
// 			};

// 			return flowNode;
// 		}).filter((node): node is Node => node !== undefined) || [];

// 		return { nodes: flowNodes, edges };
// 	} catch (error) {
// 		console.error('Error applying ELK layout:', error);
// 		// Return original nodes and edges in case of error
// 		return {
// 			nodes: nodes as Node[],
// 			edges
// 		};
// 	}
// }