import { signalColumns, messageColumns } from './signal-list';

export type SignalRow = {
	index: number;
	isSelected: boolean;
	column1: string;
	column2: string;
}

export type SignalColumn = typeof signalColumns[number];

export type MessageType = typeof messageColumns[number];

export type HintText = {
	col1: string
	col2: string
}