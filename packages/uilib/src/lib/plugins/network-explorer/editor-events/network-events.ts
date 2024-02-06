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
