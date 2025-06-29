import type { MessagePublisher } from '@/stores'
import type { Columns, SignalType } from '@/stores/signallist.store.d'

export type Label = { name: string; hasSuffix: boolean }

export type LabelText = {
	primaryInputLabel: Label
	secondaryInputLabel: Label
}

export type SignalListOnSCD = {
	selected: SignalRow[]
	matches: PdfRows
}
