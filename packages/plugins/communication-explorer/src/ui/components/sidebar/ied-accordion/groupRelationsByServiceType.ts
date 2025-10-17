import { ConnectionTypeDirection } from '.'
// TYPES
import type { ServiceObject, ServiceTypeGroup } from '.'
import type { ConnectedIEDs } from '../../_func-layout-calculation'
import type { MessageType } from '../../types'

export function groupRelationsByServiceType(
	relations: ConnectedIEDs
): ServiceTypeGroup {
	const array: ServiceTypeGroup = new Map()

	relations.subscribedFrom.forEach((element) => {
		let serviceType: MessageType | undefined = element.serviceType
		if (serviceType === undefined) {
			serviceType = 'Unknown'
		}
		{
			const keyName = `${element.serviceType}_${element.serviceTypeLabel}_Outgoing`
			const content: ServiceObject = {
				node: element.node,
				serviceType: serviceType,
				serviceTypeLabel: element.serviceTypeLabel,
				connectionDirection: ConnectionTypeDirection.OUTGOING
			}

			const hasServiceTypeElement = array.has(keyName)
			if (!hasServiceTypeElement) {
				array.set(keyName, [])
			}

			const serviceTypeElement = array.get(keyName)
			serviceTypeElement?.push(content)
		}
	})

	relations.publishedTo.forEach((element) => {
		let serviceType: MessageType | undefined = element.serviceType
		if (serviceType === undefined) {
			serviceType = 'Unknown'
		}
		{
			const keyName = `${element.serviceType}_${element.serviceTypeLabel}_Incoming`
			const content: ServiceObject = {
				node: element.node,
				serviceType: serviceType,
				serviceTypeLabel: element.serviceTypeLabel,
				connectionDirection: ConnectionTypeDirection.INCOMING
			}

			const hasServiceTypeElement = array.has(keyName)
			if (!hasServiceTypeElement) {
				array.set(keyName, [])
			}

			const serviceTypeElement = array.get(keyName)
			serviceTypeElement?.push(content)
		}
	})
	return array
}
