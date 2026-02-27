export const TYPE_ORDER = ['LNodeType', 'DOType', 'DAType', 'EnumType'] as const
export type TypeName = (typeof TYPE_ORDER)[number]

function queryLastOfTypes(
	dataTypeTemplates: Element,
	typeNames: readonly string[]
): Node | null {
	for (const typeName of typeNames) {
		const elements = Array.from(
			dataTypeTemplates.querySelectorAll(typeName)
		)
		if (elements.length > 0) {
			return elements[elements.length - 1].nextSibling
		}
	}
	return dataTypeTemplates.firstChild
}

export function queryTypeReference(
	dataTypeTemplates: Element,
	typeName: TypeName
): Node | null {
	const typeIndex = TYPE_ORDER.indexOf(typeName)
	const precedingTypes = TYPE_ORDER.slice(0, typeIndex + 1)
	return queryLastOfTypes(dataTypeTemplates, precedingTypes)
}
