export interface CommunicationElementParameters {
	selectedBays: string[]
	selectedMessageTypes: string[]
	showLegend: boolean
	showBayList: boolean
	showIEDList: boolean
	zoom: number
	diagramDimensions: { width: number; height: number } | null
}