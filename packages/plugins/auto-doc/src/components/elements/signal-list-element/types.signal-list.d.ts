import type { SignalType, Columns } from "@/stores/signallist.store.d"

export type Label = { name: string, hasSuffix: boolean }

export type LabelText = {
	col1Label: Label
	col2Label: Label
}

export type SignalRow = {
	index: number
	isSelected: boolean
	column1: string
	column2: string
	label: LabelText
	searchKey: keyof typeof SignalType | keyof  typeofColumns

}

export type HintText = {
	col1Hint: string
	col2Hint: string
}




