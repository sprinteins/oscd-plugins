// Node data types used in SvelteFlow components

/**
 * IED Node data interface
 */
export interface IEDNodeData extends Record<string, unknown> {
	iedName: string;
	bays: Set<string>;
	isRelevant: boolean;
	details?: {
		logicalNodes: string[];
		dataObjects: string[];
		dataAttributes: string[];
	};
}

/**
 * Bay Node data interface
 */
export interface BayNodeData extends Record<string, unknown> {
	bayName: string;
	isRelevant: boolean;
	isBayNode: true;
}

/**
 * Connection data interface
 */
export interface ConnectionData extends Record<string, unknown> {
	sourceIEDName: string;
	targetIEDName: string;
	serviceType: string;
	serviceCbName: string;
	datSet: string | null;
	isRelevant?: boolean;
	showLabel?: boolean;
	animated?: boolean;
}

/**
 * Published message information
 */
export interface PublishedMessage {
	id: string;
	name: string;
	targetIEDName: string;
	serviceType: string;
	serviceCbName: string;
	serviceDatSet: string;
}

/**
 * Received message information
 */
export interface ReceivedMessage {
	iedName: string;
	serviceType: string;
	srcCBName: string;
	datSet: string | null;
	data: unknown[];
}

/**
 * IED details information
 */
export interface IEDDetails {
	logicalNodes: string[];
	dataObjects: string[];
	dataAttributes: string[];
}

/**
 * Complete communication information for an IED
 */
export interface CommunicationInfo {
	iedName: string;
	iedDetails: IEDDetails;
	bays: Set<string>;
	published: PublishedMessage[];
	received: ReceivedMessage[];
}

/**
 * Custom Node type for SvelteFlow + ELK integration
 */
export interface ElkFlowNode extends Node {
	id: string;
	position: { x: number; y: number };
	data: Record<string, unknown>;
	type?: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	parentId?: string;
	extent?: string;
	children?: ElkFlowNode[];
}
