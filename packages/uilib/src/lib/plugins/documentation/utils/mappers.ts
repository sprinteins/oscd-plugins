import type { IEDConnection } from './mappers.d'
import type { IED } from '@oscd-plugins/core'

//====== PUBLIC

export function calcPublished(
	iedName: string,
	iedByBay: Map<string, IED.CommunicationInfo[]>
): IEDConnection[] {
	const publishedServiceTypes: IEDConnection[] = []

	for (const checkIed of getAllIEDsFromBay(iedByBay)) {
		for (const received of checkIed.received) {
			if (received.iedName === iedName) {
				const data: IEDConnection = {
					serviceType: received.serviceType,
					serviceTypeLabel: received.srcCBName
				}
				publishedServiceTypes.push(data)
			}
		}
	}

	// make entries unique before returning them
	return [...new Set(publishedServiceTypes)]
}

//====== PRIVATE

function getAllIEDsFromBay(
	iedByBay: Map<string, IED.CommunicationInfo[]>
): Array<IED.CommunicationInfo> {
	const ieds: Set<IED.CommunicationInfo> = new Set()

	for (const bayIEDs of iedByBay.values()) {
		for (const ied of bayIEDs) {
			ieds.add(ied)
		}
	}

	return Array.from(ieds.values())
}
