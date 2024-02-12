import type { Networking } from "@oscd-plugins/core"
import type { IED } from "./networking"
import { emptyCableName } from "../constants"

const iedPrefix = "ied-"

export function getIedNameFromId(iedId: string): string {
	return iedId.substring(iedPrefix.length)
}

export function getNetworkingWithOpenPort(ied: IED, includeCable: string | null = null): Networking[] {
	return ied.networking.filter(net => 
		!net.connectedNetworking && net.cable === emptyCableName ||
		(includeCable && net.cable === includeCable),
	)
}

export function hasOpenPort(ied: IED): boolean {
	return getNetworkingWithOpenPort(ied).length > 0
}
