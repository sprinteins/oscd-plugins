export function queryTypeReferences(elements: NodeListOf<Element>): {
	daTypeIds: Set<string>
	enumTypeIds: Set<string>
} {
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

export function queryTypesFromDOType(doTypeElement: Element): {
	daTypeIds: Set<string>
	enumTypeIds: Set<string>
} {
	const daElements = doTypeElement.querySelectorAll('DA')
	return queryTypeReferences(daElements)
}

export function queryTypesFromDAType(daTypeElement: Element): {
	daTypeIds: Set<string>
	enumTypeIds: Set<string>
} {
	const bdaElements = daTypeElement.querySelectorAll('BDA')
	return queryTypeReferences(bdaElements)
}

export function queryDOTypesFromLNodeType(lNodeType: Element): string[] {
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
