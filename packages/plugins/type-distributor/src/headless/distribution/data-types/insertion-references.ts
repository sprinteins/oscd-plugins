/**
 * Gets the insertion reference for LNodeType elements
 * LNodeTypes should be at the start of DataTypeTemplates
 */
export function getLNodeTypeReference(dataTypeTemplates: Element): Node | null {
	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Gets the insertion reference for DOType elements
 * DOTypes should come after LNodeTypes
 */
export function getDoTypeReference(dataTypeTemplates: Element): Node | null {
	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Gets the insertion reference for DAType elements
 * DATypes should come after DOTypes
 */
export function getDaTypeReference(dataTypeTemplates: Element): Node | null {
	const daTypes = Array.from(dataTypeTemplates.querySelectorAll('DAType'))
	if (daTypes.length > 0) {
		return daTypes[daTypes.length - 1].nextSibling
	}

	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Gets the insertion reference for EnumType elements
 * EnumTypes should come after DATypes (at the end)
 */
export function getEnumTypeReference(dataTypeTemplates: Element): Node | null {
	const enumTypes = Array.from(dataTypeTemplates.querySelectorAll('EnumType'))
	if (enumTypes.length > 0) {
		return enumTypes[enumTypes.length - 1].nextSibling
	}

	const daTypes = Array.from(dataTypeTemplates.querySelectorAll('DAType'))
	if (daTypes.length > 0) {
		return daTypes[daTypes.length - 1].nextSibling
	}

	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}
