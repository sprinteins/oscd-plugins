import type { ElkExtendedEdge, ElkNode } from 'elkjs'

export type IEDConnection = ElkExtendedEdge & {
	type?: string
}

export type NetworkNode = Omit<ElkNode, 'children' | 'edges'> & {
	label: string
	isBayNode?: boolean
	isRelevant?: boolean
	children: NetworkNode[]
	edges?: IEDConnection[]
}

export type BayElkNode = NetworkNode & {
	isBayNode: true
}

export type IEDElkNode = NetworkNode & {
	isBayNode: false
}

export type RootNode<ChildNode extends NetworkNode = NetworkNode> = Omit<
	ElkNode,
	'children' | 'edges'
> & {
	children: ChildNode[]
	edges?: IEDConnection[]
}
