import { ConnectionTypeDirection } from '.'
// TYPES
import type { ServiceObject, ServiceTypeGroup } from '.'
import type {
	ConnectedIED,
	ConnectedIEDs
} from '../../../../headless/services/_func-layout-calculation'
import type { MessageType } from '../../../../headless/types'

export function groupRelationsByServiceType(
	relations: ConnectedIEDs
): ServiceTypeGroup {
	const array: ServiceTypeGroup = new Map()

	relations.subscribedFrom.forEach((element) => {
		addRelation(array, element, ConnectionTypeDirection.OUTGOING)
	})

	relations.publishedTo.forEach((element) => {
		addRelation(array, element, ConnectionTypeDirection.INCOMING)
	})
	return array
}

function addRelation(
	array: ServiceTypeGroup,
	element: ConnectedIED,
	connectionDirection: ConnectionTypeDirection
) {
	const serviceType: MessageType = element.serviceType ?? 'Unknown'
	const keyName = `${serviceType}_${element.serviceTypeLabel}_${element.node.label}_${connectionDirection}`
	const content: ServiceObject = {
		node: element.node,
		serviceType,
		serviceTypeLabel: element.serviceTypeLabel,
		connectionDirection
	}

	const group = array.get(keyName)
	if (!group) {
		array.set(keyName, [content])
		return
	}

	const alreadyListed = group.some(
		(item) => item.node.label === element.node.label
	)
	if (!alreadyListed) {
		group.push(content)
	}
}
