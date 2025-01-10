import { DEFINITION_PER_VERSION } from '@/plugin/v1/constants'
// TYPES
import type { StandardVersion } from '@oscd-plugins/core-standard/ed2'
import type { Utils } from '.'

export function flattenElementDefinition(
	element: Utils.CurrentDefinitionElements,
	standardVersion: StandardVersion
) {
	const CURRENT_DEFINITION = DEFINITION_PER_VERSION[standardVersion]
	const currentElement = CURRENT_DEFINITION[element]
	return {
		tag: currentElement.tag,
		attributes: Object.keys(currentElement.attributes),
		subElements: Object.keys(currentElement.subElements)
	}
}

export function attributesToObject<
	Element extends keyof Utils.CurrentDefinition
>(attributes: NamedNodeMap) {
	const attributesObject: Record<string, string> = {}
	for (const attribute of Array.from(attributes))
		attributesObject[attribute.name] = attribute.value

	return attributesObject as Record<
		keyof Utils.CurrentDefinitionElementAttributes<Element>,
		string
	>
}
