// CONSTANTS
import { TYPE_FAMILY, CONDUCTING_EQUIPMENTS } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily } from '@/headless/stores'

//====== MAIN ======//

export function getChildrenOptions(params: {
	family: AvailableTypeFamily
	element: Element
}) {
	return {
		[TYPE_FAMILY.bay]: undefined,
		[TYPE_FAMILY.generalEquipment]: undefined,
		[TYPE_FAMILY.conductingEquipment]:
			(params.family === TYPE_FAMILY.conductingEquipment &&
				getConductingEquipmentOptions(params.element)) ||
			undefined,
		[TYPE_FAMILY.function]: undefined,
		[TYPE_FAMILY.lNodeType]: undefined
	}
}

//===== LOCAL HELPERS =====//

function getConductingEquipmentOptions(element: Element) {
	const conductingEquipmentType = element.attributes.getNamedItem('type')
	if (!conductingEquipmentType?.value)
		throw new Error('No type attribute found on conducting equipment')

	const numberOfTerminalsAllowed = Object.values(CONDUCTING_EQUIPMENTS).find(
		(equipment) => equipment.type === conductingEquipmentType.value
	)?.numberOfTerminals

	const currentTerminalsElements = Array.from(element.children).filter(
		(child) => child.tagName === 'Terminal'
	)

	const payload = {
		1: [
			{
				label: 'One',
				value: 1
			}
		],
		2: [
			{
				label: 'Two',
				value: 2
			}
		]
	}

	return {
		currentTerminalsElements,
		currentValue: currentTerminalsElements.length,
		options: numberOfTerminalsAllowed
			? payload[numberOfTerminalsAllowed]
			: [...payload[1], ...payload[2]]
	}
}
