export const TYPE_INSERTION_PRIORITY = [
	'EnumType',
	'DAType',
	'DOType',
	'LNodeType'
] as const
export type TypeName = (typeof TYPE_INSERTION_PRIORITY)[number]

export function findInsertionReference(
	dataTypeTemplates: Element,
	typeName: TypeName
): Node | null {
	const typeIndex = TYPE_INSERTION_PRIORITY.indexOf(typeName)
	const priorityTypes = TYPE_INSERTION_PRIORITY.slice(typeIndex)

	for (const name of priorityTypes) {
		const elements = Array.from(dataTypeTemplates.querySelectorAll(name))
		if (elements.length > 0) {
			return elements[elements.length - 1].nextSibling
		}
	}
	return dataTypeTemplates.firstChild
}
