import type { IEDCommInfo } from "@oscd-plugins/core"

export function getAllIEDsFromBay(iedByBay: Map<string, IEDCommInfo[]>): Array<IEDCommInfo> {
	const ieds: Set<IEDCommInfo> = new Set()

	iedByBay.forEach((bayIEDs) => {
		bayIEDs.forEach((ied) => ieds.add(ied))
	})

	return Array.from(ieds.values())
}