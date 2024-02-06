import type { Networking } from "@oscd-plugins/core"
import type { IED } from "./networking"

const iedPrefix = "ied-"

export function getIedNameFromId(iedId: string): string {
	return iedId.substring(iedPrefix.length)
}

export function getNetworkingWithOpenPort(ied: IED): Networking[] {
	return ied.networking.filter(net => !net.connectedNetworking)
}

export function hasOpenPort(ied: IED): boolean {
	return getNetworkingWithOpenPort(ied).length > 0
}
