import { MessageType, type IEDCommInfo } from "@oscd-plugins/core"
import type { IEDConnectionWithCustomValues } from "../../../components/diagram"
import { hasActiveIEDSelection, isIEDSelected, type SelectedFilter } from "../_store-view-filter"

export const messageTypeMap:{[key: string]: MessageType} = {
	"GOOSE":   MessageType.GOOSE,
	"SMV":     MessageType.SampledValues,
	"MMS":     MessageType.MMS,
	"UNKNOWN": MessageType.Unknown,
}

export function generateConnectionLayout(ieds: IEDCommInfo[], selectionFilter: SelectedFilter): IEDConnectionWithCustomValues[] {
	
	const hasSelection = hasActiveIEDSelection()
	
	const incomingEdges: IEDConnectionWithCustomValues[] = ieds.map( (targetIED, index) => { 
		const receivedConnections = convertReceivedMessagesToConnections(
			targetIED, 
			ieds, 
			index, 
			selectionFilter, 
			hasSelection, 
		)

		return receivedConnections
	}).flat()
	

	const outgoingEdges: IEDConnectionWithCustomValues[] = ieds.map( (sourceIED, iedIndex) => {
		const publishedConnections = convertPublishedMessagesToConnections(
			sourceIED, 
			ieds, 
			iedIndex, 
			selectionFilter, 
			hasSelection, 
		)

		return publishedConnections
	}).flat()
	

	return [...incomingEdges, ...outgoingEdges]
}

// TODO: probably would be nice to test this function
function convertPublishedMessagesToConnections(
	sourceIED: IEDCommInfo, 
	ieds: IEDCommInfo[], 
	iedIndex: number, 
	selectionFilter: SelectedFilter, 
	hasSelection: boolean, 
): IEDConnectionWithCustomValues[] {
	
	let connectionCounter = 0
	const iedConnections: IEDConnectionWithCustomValues[] = []
	
	sourceIED.published.forEach(message => {
		// 
		// Prepare
		// 
		const targetIEDName = message.targetIEDName
		const targetIEDIndex = ieds.findIndex((targetIED) => targetIED.iedName === targetIEDName)
		if (targetIEDIndex === -1) {
			console.warn({ level: "warn", msg: "calculateLayout: source IED not found, continuing", targetIEDName, ieds })
			return
		}
		const targetIED = ieds[targetIEDIndex]
		const messageType = messageTypeMap[message.serviceType]
		const messageTypeLabel = message.serviceCbName
		const connectionID = `con_published_${Id(targetIEDIndex)}_${Id(iedIndex)}_${messageType}_${messageTypeLabel}_${connectionCounter++}`

		// 
		// Relevancy
		// 
		const selectedMessageTypes: string[] = selectionFilter.selectedMessageTypes
		const isUnknownMessageType: boolean = messageType === undefined
		const isRelevantMessageType: boolean = (selectedMessageTypes.includes(messageType) || isUnknownMessageType)
		
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
		// console.log({level: "dev", msg: "IEDConnectionWithCustomValues", message, checkRelevance: checkRelevance(selectionFilter, targetIED, sourceIED), isRelevant, isRelevantMessageType, selectedMessageTypes, messageType, selectionFilter, targetIED, sourceIED})

		// 
		// Assembly
		// 
		const connection = {
			id:               connectionID,
			sources:          [Id(iedIndex)],
			targets:          [Id(targetIEDIndex)],
			sourceIED:        sourceIED,
			targetIED:        targetIED,
			isRelevant,
			relevantIEDNames: [sourceIED.iedName, targetIED.iedName],
			messageType:      messageType,
			messageTypeLabel: messageTypeLabel,
		}

		iedConnections.push(connection)
	})
	return iedConnections
}

function convertReceivedMessagesToConnections(
	targetIED: IEDCommInfo, 
	ieds: IEDCommInfo[], 
	iedIndex: number, 
	selectionFilter: SelectedFilter, 
	hasSelection: boolean, 
): IEDConnectionWithCustomValues[] {
	let connectionCounter = 0
	const iedConnections: IEDConnectionWithCustomValues[] = []
	targetIED.received.forEach(message => {

		// 
		// Prepare
		// 
		const sourceIEDName = message.iedName
		const sourceIEDIndex = ieds.findIndex((sourceIED) => sourceIED.iedName === sourceIEDName)
		if (sourceIEDIndex === -1) {
			console.warn({ level: "warn", msg: "calculateLayout: source IED not found, continuing", sourceIEDName, ieds })
			return
		}
		const sourceIED = ieds[sourceIEDIndex]
		const targetIED = ieds[iedIndex]

		const selectedMessageTypes: string[] = selectionFilter.selectedMessageTypes
		const messageType = messageTypeMap[message.serviceType]
		const messageTypeLabel = message.srcCBName

		// 
		// Relevancy
		// 
		// check messageType for undefined so unknown message types are also displayed
		const isUnknownMessageType: boolean = (messageType === undefined && selectedMessageTypes.includes("Unknown"))
		const isRelevantMessageType: boolean = (selectedMessageTypes.includes(messageType) || isUnknownMessageType)

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

		// 
		// Assembly
		// 
		const connection = {
			id:               connectionID,
			sources:          [Id(sourceIEDIndex)],
			targets:          [Id(iedIndex)],
			sourceIED:        sourceIED,
			targetIED:        targetIED,
			isRelevant,
			relevantIEDNames: [targetIED.iedName, sourceIED.iedName],
			messageType:      messageType,
			messageTypeLabel: messageTypeLabel,
		}
		iedConnections.push(connection)
	})
	return iedConnections
}

function checkRelevance(selectionFilter: SelectedFilter, targetIED: IEDCommInfo, sourceIED: IEDCommInfo): boolean {
	
	const isTargetIEDSelected = isIEDSelected({label: targetIED.iedName})
	const isSourceIEDSelected = isIEDSelected({label: sourceIED.iedName})

	if (selectionFilter.outgoingConnections && !selectionFilter.incomingConnections) {
		return isTargetIEDSelected
	}
	
	if (selectionFilter.incomingConnections && !selectionFilter.outgoingConnections) {
		return isSourceIEDSelected
	}
	
	if (selectionFilter.incomingConnections && selectionFilter.outgoingConnections) {
		return isSourceIEDSelected || isTargetIEDSelected
	}
	
	const everythingIsRelevantIfThereIsNoSelection = true
	return everythingIsRelevantIfThereIsNoSelection
}

export function Id(something: unknown): string {
	return `ied-${something}`
}
