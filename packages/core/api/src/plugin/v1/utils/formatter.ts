import { DEFINITION_PER_VERSION } from '@/plugin/v1/constants'
// TYPES
import type { AvailableStandardVersion } from '@oscd-plugins/core-standard'
import type { Utils } from '.'

export function flattenElementDefinition(
<<<<<<< Updated upstream
	element: Utils.CurrentDefinitionElements,
	standardVersion: StandardVersion
=======
	element: Utils.CurrentDefinitionElement<typeof standardVersion>,
	standardVersion: AvailableStandardVersion
>>>>>>> Stashed changes
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
	GenericVersion extends AvailableStandardVersion,
	Element extends keyof Utils.CurrentDefinition<GenericVersion>
>(attributes: NamedNodeMap) {
	const attributesObject: Record<string, string> = {}
	for (const attribute of Array.from(attributes))
		attributesObject[attribute.name] = attribute.value

	return attributesObject as Record<
		keyof Utils.CurrentDefinitionElementAttributes<GenericVersion, Element>,
		string
	>
}
