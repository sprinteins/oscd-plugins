import type { IEDCommInfo } from "@oscd-plugins/core"
import { getAllIEDsFromBay } from "."

export type IEDConnection = {
	serviceType: string,
	serviceTypeLabel: string,
}

export function calcPublished(iedName: string, iedByBay: Map<string, IEDCommInfo[]>): IEDConnection[] {
	const publishedServiceTypes: IEDConnection[] = []

	for (const checkIed of getAllIEDsFromBay(iedByBay)) {
		for (const received of checkIed.received) {
			if (received.iedName === iedName) {
				const data: IEDConnection = {
					serviceType:      received.serviceType,
					serviceTypeLabel: received.srcCBName,
				} 
				publishedServiceTypes.push(data)
			}
		}
	}

	// make entries unique before returning them
	return [...new Set(publishedServiceTypes)]
}