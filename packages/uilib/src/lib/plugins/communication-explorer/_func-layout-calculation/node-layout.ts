import ELK from 'elkjs/lib/elk.bundled'
import { generateConnectionLayout } from '.'
import { generateIEDLayout } from './node-layout-ieds'

// TYPES
import type { IED } from '@oscd-plugins/core'
import type { Config } from './config'
import type { Preferences } from '../_store-preferences'
import type { IEDConnectionWithCustomValues, IEDNode, RootNode } from '../../../components/diagram'
import type { SelectedFilter } from '../_store-view-filter'
import type { ElkNode } from 'elkjs/lib/elk.bundled'

const defaultConfigs: Partial<Config> = {
	spacingBase: 20,
	spacingBetweenNodes: 20
}

export async function calculateLayout(
	ieds: IED.CommunicationInfo[],
	config: Config,
	selectionFilter: SelectedFilter,
	preferences: Preferences
): Promise<RootNode> {
	config = {
		...defaultConfigs,
		...config
	}

	if (selectionFilter.nameFilter !== '') {
		ieds = ieds.filter((ied) =>
			ied.iedName
				.toLowerCase()
				.includes(selectionFilter.nameFilter.toLowerCase())
		)
	}

	let edges = generateConnectionLayout(ieds, selectionFilter)
	let children: IEDNode[] = generateIEDLayout(ieds, edges, config)
	children = generateBayLayout(children, edges, config)

	if (preferences.isFocusModeOn) {
		children = children.filter((child) => child.isRelevant)
		edges = edges.filter((edge) => edge.isRelevant)
	}

	const elk = new ELK()

	// Need more configuration options of elk.js?
	// 👉 https://www.eclipse.org/elk/reference/algorithms.html
	const graph: ElkNode = {
		id: 'graph-root',
		layoutOptions: {
			'elk.algorithm': 'org.eclipse.elk.layered',			
			'org.eclipse.elk.layered.unnecessaryBendpoints': 'true',
			'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment':
				'RIGHTUP',
			'org.eclipse.elk.direction': 'LEFT',
			'org.eclipse.elk.hierarchyHandling': 'INCLUDE_CHILDREN',

			// default: 20; a component is when multiple nodes are connected
			// "org.eclipse.elk.spacing.componentComponent": "20",

			'org.eclipse.elk.layered.spacing.baseValue': String(
				config.spacingBase
			),
			'org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers': String(
				config.spacingBetweenNodes
			)
		},
		children,
		edges
	}

	// message type information gets lost here
	const root = (await elk.layout(graph)) as RootNode

	// everything about this is horrible, it is just meant as a proof of concept for bay containers for now
	// TODO: make rendering in Svelte more flexible so that it expects the data as it is returned by ELK 
	// and none of this is necessary in the first place
	for (const node of root.children) {
		if (node.isBayNode) {

			//find all connections that have both source and target IED within the same bay
			//ELK will calculate positions of such connections in local space of the parent bay (I didn't find a way to change that...)
			//we are not expecting local positions but absolute positions so we have to add the position of the bay to each affected Connection
			if (root.edges) {
				for (const edge of root.edges) {
					if (node.children.some(ied => ied.label == edge.sourceIED.iedName) &&
						node.children.some(ied => ied.label == edge.targetIED.iedName)) {
						if (edge.sections) {
							for (const section of edge.sections) {
								if (node.x !== undefined && node.y !== undefined) {
									section.startPoint.x += node.x
									section.startPoint.y += node.y
									section.endPoint.x += node.x
									section.endPoint.y += node.y
									if (section.bendPoints) {
										for (const bendpoint of section.bendPoints) {
											bendpoint.x += node.x
											bendpoint.y += node.y
										}
									}
								}
							}						
						}
					}
				}
			}

			for (const child of node.children) {
				
				//ELK only gives us local positions for child IEDs (I couldn't find a way to change that...)
				//as a workaround we add the bay's position to all it's child IEDs
				if (node.x !== undefined && node.y !== undefined) {
					child.x = node.x + (child.x ?? 0)
					child.y = node.y + (child.y ?? 0)
				}

				//moving all bay node children to the root node
				//ELK only works properly if bays have all their IEDs as children, 
				//but we expect all IEDs to be children of the root node so this is necessary
				root.children.push(child)
			}
			node.children = []
		}
	}

	return root
}

function generateBayLayout(ieds: IEDNode[], edges: IEDConnectionWithCustomValues[], config: Config): IEDNode[] {

	let children: IEDNode = []
	let bays: IEDNode = []
	let id = 0
	for (const ied of ieds) {
		if (ied.bays.size == 0) {
			children.push(ied);
			continue;
		}
		let bayLabel = ied.bays.values().next().value;
		let bayNode: IEDNode = (children.find(b => b.label === bayLabel && b.isBayNode))
		if (bayNode) {
			bayNode.children.push(ied);
			bayNode.isRelevant |= ied.isRelevant
		}
		else {
			let spacing = config.spacingBase ?? 20
			bayNode = {
				id:         	"bay-" + (id++), //placeholder
				width:      	config.width,
				height:     	config.height,
				label:      	bayLabel,
				isRelevant: 	ied.isRelevant,
				isBayNode:		true,
				children:   	[ied], //IEDs must be children of their bays, otherwise ELK won't calculate proper layouts!
				layoutOptions: {
					'elk.padding': `[top=${spacing * 2},left=${spacing},right=${spacing},bottom=${spacing}]` //double top spacing to account for baycontainer label!
				},
			}
			children.push(bayNode)
			bays.push(bayNode)
		}
	}

	return children
}
