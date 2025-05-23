import type { SignalType, Columns, PdfRowStructure } from "@/stores/signallist.store.d"
import type {MessagePublisher}  from '@/stores';

export type Label = { name: string, hasSuffix: boolean }

export type LabelText = {
	col1Label: Label
	col2Label: Label
}

export type SignalRow = {
	id: string;
	index: number;
	isSelected: boolean;
	column1: string;
	column2: string;
	label: LabelText;
	searchKey: keyof typeof SignalType | keyof typeof Columns;
}

export type PdfRows = {
	matchedRowsForTablePdf: PdfRowStructure[]
}

export type SignalListOnSCD = {
	selected: SignalRow[];
	matches: PdfRows;
}





