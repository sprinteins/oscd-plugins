import type { IED } from "../diagram/networking"

export interface CreateCableEvent {
	cable: string;
	source: {
		ied: IED;
		port: string;
	};
	target: {
		ied: IED;
		port: string
	};
}
