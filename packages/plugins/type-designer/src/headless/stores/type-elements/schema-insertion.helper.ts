import { REF_FAMILY } from '@/headless/constants'
import type { AvailableRefFamily } from '@/headless/stores'

type SchemaOrderedElement = AvailableRefFamily | 'Terminal'

const SCHEMA_INSERTION_BOUNDARIES: Partial<
	Record<SchemaOrderedElement, readonly string[]>
> = {
	[REF_FAMILY.generalEquipment]: [
		'ConductingEquipment',
		'ConnectivityNode',
		'Function'
	],
	[REF_FAMILY.conductingEquipment]: ['ConnectivityNode', 'Function'],
	Terminal: ['SubEquipment', 'EqFunction']
}

export function getSchemaInsertBeforeReference(params: {
	elementName: SchemaOrderedElement
	parentTypeWrapper: Element
}): Element | null {
	const boundaryNames = SCHEMA_INSERTION_BOUNDARIES[params.elementName]
	if (!boundaryNames) return null

	return (
		Array.from(params.parentTypeWrapper.children).find((child) =>
			boundaryNames.includes(child.localName)
		) ?? null
	)
}
