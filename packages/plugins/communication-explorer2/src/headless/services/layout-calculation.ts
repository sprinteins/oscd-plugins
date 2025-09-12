import ELK from 'elkjs/lib/elk.bundled'
import type { ElkNode } from 'elkjs/lib/elk.bundled'
import type { IED } from '@oscd-plugins/core'
import { MESSAGE_TYPE } from '@oscd-plugins/core'
import type { Config } from '../types/index.js'
import type { SelectedFilter } from '../stores/filter-store.js'
import type { Preferences } from '../stores/preferences-store.js'
import type { RootNode, IEDElkNode, IEDConnectionWithCustomValues } from '@oscd-plugins/ui/src/components/diagram/index.js'
import { isIEDSelected, hasActiveIEDSelection } from '../stores/filter-store.js'

const defaultConfigs: Partial<Config> = {
	spacingBase: 20,
	spacingBetweenNodes: 20
}

const messageTypeMap: {
	[key: string]: string
} = {
	GOOSE: MESSAGE_TYPE.GOOSE,
	SMV: MESSAGE_TYPE.SampledValues,
	MMS: MESSAGE_TYPE.MMS,
	UNKNOWN: MESSAGE_TYPE.Unknown
}

/**
 * Calculate layout for IED nodes and connections using ELK.js
 */
export async function calculateLayout(
	ieds: IED.CommunicationInfo[],
	configParam: Config,
	selectionFilter: SelectedFilter,
	preferences: Preferences
): Promise<RootNode> {
	const config = {
		...defaultConfigs,
		...configParam
	}

	let filteredIeds = ieds
	if (selectionFilter.nameFilter && selectionFilter.nameFilter !== '') {
		filteredIeds = ieds.filter((ied) =>
			ied.iedName
				.toLowerCase()
				.includes(selectionFilter.nameFilter.toLowerCase())
		)
	}

	// Generate layout data
	let edges = generateConnectionLayout(filteredIeds, selectionFilter)
	let children: IEDElkNode[] = generateIEDLayout(filteredIeds, edges, config, preferences)
	
	if (preferences.groupByBay) {
		children = generateBayLayout(children, edges, config)
	}

	if (preferences.isFocusModeOn) {
		children = children.filter(child => child.isRelevant)
		if (preferences.groupByBay) {
			for (const bayNode of children) {
				bayNode.children = bayNode.children?.filter(child => child.isRelevant)
			}
		}
		edges = edges.filter(edge => edge.isRelevant)
	}

	// Convert children to ElkNode format for ELK layout
	const elkChildren = children.map((child, index) => ({
		id: `ied-${index}`,
		width: child.width,
		height: child.height,
		layoutOptions: child.layoutOptions,
		...child
	}))

	const elk = new ELK()
	const baylabelBuffer = (config.bayLabelGap || 0) + (config.bayLabelHeight || 0)

	const graph: ElkNode = {
		id: 'graph-root',
		layoutOptions: {
			'elk.algorithm': 'org.eclipse.elk.layered',			
			'org.eclipse.elk.layered.unnecessaryBendpoints': 'true',
			'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'RIGHTUP',
			'org.eclipse.elk.direction': 'LEFT',
			'org.eclipse.elk.hierarchyHandling': 'INCLUDE_CHILDREN',
				'elk.layered.spacing.baseValue': String(config.spacingBase || 20),
			'elk.layered.spacing.nodeNodeBetweenLayers': String(config.spacingBetweenNodes || 20),

			...(!preferences.groupByBay && {
				'org.eclipse.elk.hierarchyHandling': 'SEPARATE_CHILDREN',
					'elk.padding': `[top=${baylabelBuffer}]`,
				'elk.spacing.edgeNode': `${baylabelBuffer}`,
				'elk.spacing.nodeNode': `${baylabelBuffer + (config.spacingBase ?? 0)}`
			})
		},
		children: elkChildren,
		edges
	}

	const elkResult = await elk.layout(graph)

	// Convert back to RootNode format
	const root: RootNode = {
		children: children.map((child, index) => ({
			...child,
			x: elkResult.children?.[index]?.x || 0,
			y: elkResult.children?.[index]?.y || 0,
			width: elkResult.children?.[index]?.width || child.width,
			height: elkResult.children?.[index]?.height || child.height
		})),
		edges,
		x: elkResult.x || 0,
		y: elkResult.y || 0,
		width: elkResult.width || 0,
		height: elkResult.height || 0
	}

	if (!preferences.groupByBay) {
		return root
	}

	// Post-process for bay grouping
	for (const node of root.children) {
		if (node.isBayNode) {
			if (root.edges) {
				for (const edge of root.edges) {
					if (node.children?.some(ied => ied.label === edge.sourceIED?.iedName) &&
						node.children?.some(ied => ied.label === edge.targetIED?.iedName)) {
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

			for (const child of node.children || []) {
				if (node.x !== undefined && node.y !== undefined) {
					child.x = node.x + (child.x ?? 0)
					child.y = node.y + (child.y ?? 0)
				}
				root.children.push(child)
			}
			node.children = []
		}
	}

	return root
}

function generateConnectionLayout(ieds: IED.CommunicationInfo[], selectionFilter: SelectedFilter): IEDConnectionWithCustomValues[] {
	const hasSelection = hasActiveIEDSelection()

	const incomingEdges: IEDConnectionWithCustomValues[] = ieds
		.map((targetIED, index) => {
			const receivedConnections = convertReceivedMessagesToConnections(
				targetIED,
				ieds,
				index,
				selectionFilter,
				hasSelection
			)

			return receivedConnections
		})
		.flat()

	const outgoingEdges: IEDConnectionWithCustomValues[] = ieds
		.map((sourceIED, iedIndex) => {
			const publishedConnections = convertPublishedMessagesToConnections(
				sourceIED,
				ieds,
				iedIndex,
				selectionFilter,
				hasSelection
			)

			return publishedConnections
		})
		.flat()

	return [...incomingEdges, ...outgoingEdges]
}

function convertPublishedMessagesToConnections(
	sourceIED: IED.CommunicationInfo,
	ieds: IED.CommunicationInfo[],
	iedIndex: number,
	selectionFilter: SelectedFilter,
	hasSelection: boolean
): IEDConnectionWithCustomValues[] {
	let connectionCounter = 0
	const iedConnections: IEDConnectionWithCustomValues[] = []

	sourceIED.published.forEach((message) => {
		const targetIEDName = message.targetIEDName
		const targetIEDIndex = ieds.findIndex(
			(targetIED) => targetIED.iedName === targetIEDName
		)
		if (targetIEDIndex === -1) {
			console.warn({
				level: 'warn',
				msg: 'calculateLayout: source IED not found, continuing',
				targetIEDName,
				ieds
			})
			return
		}
		const targetIED = ieds[targetIEDIndex]
		const messageType = messageTypeMap[message.serviceType]
		const messageTypeLabel = message.serviceCbName
		const connectionID = `con_published_${Id(targetIEDIndex)}_${Id(iedIndex)}_${messageType}_${messageTypeLabel}_${connectionCounter++}`

		const selectedMessageTypes: string[] = selectionFilter.selectedMessageTypes
		const isUnknownMessageType: boolean = messageType === undefined
		const isRelevantMessageType: boolean =
			selectedMessageTypes.includes(messageType) || isUnknownMessageType

		let isRelevant = true
		if (hasSelection) {
			isRelevant = checkRelevance(selectionFilter, targetIED, sourceIED)
			if (isRelevant && !isRelevantMessageType) {
				isRelevant = false
			}
		} else {
			if (!isRelevantMessageType) {
				isRelevant = false
			}
		}

		const connection = {
			id: connectionID,
			sources: [Id(iedIndex)],
			targets: [Id(targetIEDIndex)],
			sourceIED: sourceIED,
			targetIED: targetIED,
			isRelevant,
			relevantIEDNames: [sourceIED.iedName, targetIED.iedName],
			messageType: messageType,
			messageTypeLabel: messageTypeLabel
		}

		iedConnections.push(connection)
	})
	return iedConnections
}

function convertReceivedMessagesToConnections(
	targetIED: IED.CommunicationInfo,
	ieds: IED.CommunicationInfo[],
	iedIndex: number,
	selectionFilter: SelectedFilter,
	hasSelection: boolean
): IEDConnectionWithCustomValues[] {
	let connectionCounter = 0
	const iedConnections: IEDConnectionWithCustomValues[] = []
	targetIED.received.forEach((message) => {
		const sourceIEDName = message.iedName
		const sourceIEDIndex = ieds.findIndex(
			(sourceIED) => sourceIED.iedName === sourceIEDName
		)
		if (sourceIEDIndex === -1) {
			console.warn({
				level: 'warn',
				msg: 'calculateLayout: source IED not found, continuing',
				sourceIEDName,
				ieds
			})
			return
		}
		const sourceIED = ieds[sourceIEDIndex]
		const targetIED = ieds[iedIndex]

		const selectedMessageTypes: string[] = selectionFilter.selectedMessageTypes
		const messageType = messageTypeMap[message.serviceType]
		const messageTypeLabel = message.srcCBName

		const isUnknownMessageType: boolean =
			messageType === undefined &&
			selectedMessageTypes.includes('Unknown')
		const isRelevantMessageType: boolean =
			selectedMessageTypes.includes(messageType) || isUnknownMessageType

		let isRelevant = true
		if (hasSelection) {
			isRelevant = checkRelevance(selectionFilter, targetIED, sourceIED)
			if (isRelevant && !isRelevantMessageType) {
				isRelevant = false
			}
		} else {
			if (!isRelevantMessageType) {
				isRelevant = false
			}
		}

		const connectionID = `con_received_${Id(sourceIEDIndex)}_${Id(iedIndex)}_${messageType}_${connectionCounter}`
		connectionCounter++

		const connection = {
			id: connectionID,
			sources: [Id(sourceIEDIndex)],
			targets: [Id(iedIndex)],
			sourceIED: sourceIED,
			targetIED: targetIED,
			isRelevant,
			relevantIEDNames: [targetIED.iedName, sourceIED.iedName],
			messageType: messageType,
			messageTypeLabel: messageTypeLabel
		}
		iedConnections.push(connection)
	})
	return iedConnections
}

function checkRelevance(
	selectionFilter: SelectedFilter,
	targetIED: IED.CommunicationInfo,
	sourceIED: IED.CommunicationInfo
): boolean {
	const isTargetIEDSelected = isIEDSelected({ label: targetIED.iedName })
	const isSourceIEDSelected = isIEDSelected({ label: sourceIED.iedName })

	if (
		selectionFilter.outgoingConnections &&
		!selectionFilter.incomingConnections
	) {
		return isTargetIEDSelected
	}

	if (
		selectionFilter.incomingConnections &&
		!selectionFilter.outgoingConnections
	) {
		return isSourceIEDSelected
	}

	if (
		selectionFilter.incomingConnections &&
		selectionFilter.outgoingConnections
	) {
		return isSourceIEDSelected || isTargetIEDSelected
	}

	const everythingIsRelevantIfThereIsNoSelection = true
	return everythingIsRelevantIfThereIsNoSelection
}

function generateIEDLayout(ieds: IED.CommunicationInfo[], edges: IEDConnectionWithCustomValues[], config: Config, preferences: Preferences): IEDElkNode[] {
	const hasSelection = hasActiveIEDSelection()

	const relevantEdges = edges.filter((edge) => edge.isRelevant)
	const relevantNodes = new Set<string>()
	for (const edge of relevantEdges) {
		if (edge.relevantIEDNames) {
			for (const iedName of edge.relevantIEDNames) {
				relevantNodes.add(iedName)
			}
		}
	}

	const children: IEDElkNode[] = ieds.map((ied, ii) => {
		let isRelevant = true
		if (hasSelection) {
			const isNodeRelevant = relevantNodes.has(ied.iedName)
			const isNodeSelected = isIEDSelected({ label: ied.iedName })
			isRelevant = isNodeRelevant || isNodeSelected
		}

		return {
			id: Id(ii), // Add the missing id property required by ELK.js
			label: ied.iedName,
			isRelevant: isRelevant,
			children: [],
			details: ied.iedDetails,
			bays: ied.bays,
			bayLabelHeight: config.bayLabelHeight || 15,
			bayLabelGap: config.bayLabelGap || 2,
			iedHeight: config.iedHeight || 40,
			x: 0,
			y: 0,
			width: config.iedWidth || 150,
			height: config.iedHeight || 40
		} as IEDElkNode
	})

	return children
}

function Id(something: unknown): string {
	return `ied-${something}`
}

function generateBayLayout(ieds: IEDElkNode[], edges: IEDConnectionWithCustomValues[], config: Config): IEDElkNode[] {
	const children: IEDElkNode[] = []
	let bayCounter = 0
	
	for (const ied of ieds) {
		if (!ied.bays || ied.bays.size === 0) {
			children.push(ied)
			continue
		}
		
		const bayLabel = ied.bays.values().next().value
		let bayNode = children.find(b => b.label === bayLabel && b.isBayNode)
		
		if (bayNode) {
			if (!bayNode.children) bayNode.children = []
			bayNode.children.push(ied)
			bayNode.isRelevant = (bayNode.isRelevant || false) || (ied.isRelevant || false)
		} else {
			const spacing = config.spacingBase ?? 20
			bayNode = {
				id: `bay-${bayCounter++}`, // Add the missing id property for bay nodes
				label: bayLabel,
				isRelevant: ied.isRelevant || false,
				isBayNode: true,
				children: [ied],
				details: {
					logicalNodes: [],
					dataObjects: [],
					dataAttributes: []
				},
				bays: new Set([bayLabel]),
				bayLabelHeight: config.bayLabelHeight || 15,
				bayLabelGap: config.bayLabelGap || 2,
				iedHeight: config.iedHeight || 40,
				layoutOptions: {
					'elk.padding': `[top=${spacing * 2},left=${spacing},right=${spacing},bottom=${spacing}]`
				},
				x: 0,
				y: 0,
				width: config.iedWidth || 150,
				height: config.iedHeight || 40
			} as IEDElkNode
			children.push(bayNode)
		}
	}

	return children
}