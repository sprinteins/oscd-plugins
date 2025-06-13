import type { MessagePublisher } from '@/stores'
import type {
	Columns,
	PdfRowStructure,
	SignalType
} from '@/stores/signallist.store.d'

export type Label = { name: string; hasSuffix: boolean }

export type LabelText = {
	primaryInputLabel: Label
	secondaryInputLabel: Label
}

export type SignalRow = {
	id: string
	index: number
	isSelected: boolean
	primaryInput: string
	secondaryInput: string
	label: LabelText
	searchKey: keyof typeof SignalType | keyof typeof Columns
}

export type PdfRows = {
	matchedRowsForTablePdf: PdfRowStructure[]
}

export type SignalListOnSCD = {
	selected: SignalRow[]
	matches: PdfRows
}
