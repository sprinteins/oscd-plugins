import type { SignalType, Columns, PdfRowStructure } from "@/stores/signallist.store.d"
import type {MessagePublisher}  from '@/stores';

export type Label = { name: string, hasSuffix: boolean }

export type LabelText = {
	primaryInputLabel: Label
	secondaryInputLabel: Label
}

export type SignalListOnSCD = {
	selected: SignalRow[];
	matches: PdfRows;
}





