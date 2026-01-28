export function collectTypeReferences(
	elements: NodeListOf<Element>
): { daTypeIds: Set<string>; enumTypeIds: Set<string> } {
	const daTypeIds = new Set<string>()
	const enumTypeIds = new Set<string>()

	for (const element of elements) {
		const typeAttr = element.getAttribute('type')
		const bType = element.getAttribute('bType')

		if (typeAttr) {
			if (bType === 'Struct') {
				daTypeIds.add(typeAttr)
			} else if (bType === 'Enum') {
				enumTypeIds.add(typeAttr)
			}
		}
	}

	return { daTypeIds, enumTypeIds }
}

export function collectTypesFromDOType(
	doTypeElement: Element
): { daTypeIds: Set<string>; enumTypeIds: Set<string> } {
	const daElements = doTypeElement.querySelectorAll('DA')
	return collectTypeReferences(daElements)
}

export function collectTypesFromDAType(
	daTypeElement: Element
): { daTypeIds: Set<string>; enumTypeIds: Set<string> } {
	const bdaElements = daTypeElement.querySelectorAll('BDA')
	return collectTypeReferences(bdaElements)
}

export function collectDOTypesFromLNodeType(lNodeType: Element): string[] {
	const doElements = lNodeType.querySelectorAll('DO')
	const doTypeIds: string[] = []

	for (const doElement of doElements) {
		const typeAttr = doElement.getAttribute('type')
		if (typeAttr) {
			doTypeIds.push(typeAttr)
		}
	}

	return doTypeIds
}
