export interface CommunicationElementParameters {
	selectedBays: string[]
	messageTypeRows: MessageTypeRow[]
	showLegend: boolean
	showBayList: boolean
	showIEDList: boolean
	zoom: number
	diagramDimensions: { width: number; height: number } | null
}

export interface ConnectionFilter {
	sourceIEDPattern: string
	targetIEDPattern: string
	messageType: string
}

export interface MessageTypeRow {
	id: number
	enabled: boolean
	messageType: string
	sourceIEDPattern: string
	targetIEDPattern: string
}
