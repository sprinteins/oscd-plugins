import type { IED } from "../diagram/networking"

export interface CreateCableIED {
	ied: IED;
	port: string;
}
export interface CreateCableEvent {
	cable: string;
	source: CreateCableIED;
	target: CreateCableIED;
}

export interface UpdateCableIED {
	ied: IED;
	oldPort: string;
	newPort: string;
}

export interface UpdateCableEvent {
	cable: string;
	source: UpdateCableIED;
	target: UpdateCableIED;
}
