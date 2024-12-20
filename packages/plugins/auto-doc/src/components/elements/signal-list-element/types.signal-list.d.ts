import { signalColumns, messageTypes } from './signal-list';

export type SignalRow = {
	index: number;
	isSelected: boolean;
	column1: string;
	column2: string;
}

export type SignalColumn = typeof signalColumns[number];

export type MessageType = typeof messageTypes[number];

export type HintText = {
	col1Hint: string
	col2Hint: string
}

export type Label = { name: string, hasSuffix: boolean }

export type LabelText = {
	col1Label: Label
	col2Label: Label
}


