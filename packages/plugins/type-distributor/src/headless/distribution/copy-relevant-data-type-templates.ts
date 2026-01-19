import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { DOType, LNodeTemplate } from '../types'
import { ssdImportStore } from '../stores'
import type { Insert } from '@openscd/oscd-api'
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'

export function copyRelevantDataTypeTemplates(
	lnodeFromSSD: LNodeTemplate
): void {
	const scd = pluginGlobalStore.xmlDocument
	if (!scd) {
		throw new Error('No XML document loaded')
	}

	const dataTypeTemplates = getOrCreateDataTypeTemplate()

	// Step 1: Copy LNodeType if it doesn't exist
	copyLNodeType(lnodeFromSSD, scd, dataTypeTemplates)

	// Step 2: Copy all referenced DOTypes and their dependencies
	const lnodeTypeInSSD = ssdImportStore.lnodeTypes.find(
		(lnt) =>
			lnt.id === lnodeFromSSD.lnType
	)

	if (lnodeTypeInSSD) {
		const referencedDoTypeIds = Array.from(
			new Set(lnodeTypeInSSD.dataObjects.map((d) => d.type))
		)
		copyDoTypes(referencedDoTypeIds, scd, dataTypeTemplates)
	}
}


function copyLNodeType(
	lnodeFromSSD: LNodeTemplate,
	scd: XMLDocument,
	dataTypeTemplates: Element
): void {
	const existingLNodeType = scd.querySelector(
		`LNodeType[lnClass="${lnodeFromSSD.lnClass}"][id="${lnodeFromSSD.lnType}"]`
	)
	if (existingLNodeType) {
		return
	}

	// Find LNodeType in SSD store
	const lnodeTypeInSSD = ssdImportStore.lnodeTypes.find(
		(lnt) =>
			lnt.id === lnodeFromSSD.lnType
	)
	if (!lnodeTypeInSSD) {
		throw new Error(
			`LNodeType with lnClass ${lnodeFromSSD.lnClass} and id ${lnodeFromSSD.lnType} not found in SSD`
		)
	}

    // Clone LNodeType element
    const lnodeTypeElement = ssdImportStore.loadedSSDDocument?.querySelector(
        `LNodeType[[id="${lnodeFromSSD.lnType}"]`
    )?.cloneNode(true) as Element;
    if (!lnodeTypeElement) {
        throw new Error(
            `LNodeType element with lnClass ${lnodeFromSSD.lnClass} and id ${lnodeFromSSD.lnType} not found in SSD document`
        );
    }

	// Insert at appropriate position
	const lNodeReference = getReferenceForLNodeType(dataTypeTemplates)
	const edit: Insert = {
		parent: dataTypeTemplates,
		reference: lNodeReference,
		node: lnodeTypeElement
	}

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: edit
	})
}

/**
 * Recursively copies DOTypes and their dependent DATypes and EnumTypes.
 */
function copyDoTypes(
	doTypeIds: string[],
	scd: XMLDocument,
	dataTypeTemplates: Element
): void {
	const daTypeIdsToCopy = new Set<string>()
	const enumTypeIdsToCopy = new Set<string>()

	for (const doTypeId of doTypeIds) {
		// Skip if DOType already exists
		if (scd.querySelector(`DOType[id="${doTypeId}"]`)) {
			continue
		}

		// Find DOType in SSD
		const doTypeNode = ssdImportStore.loadedSSDDocument?.querySelector(
			`DOType[id="${doTypeId}"]`
		)
		if (!doTypeNode) {
			console.warn(`DOType with id="${doTypeId}" not found in SSD`)
			continue
		}

		// Clone and insert DOType
        const clonedDoType = doTypeNode.cloneNode(true) as Element;
		const doTypeReference = getReferenceForDoType(dataTypeTemplates)
		const edit: Insert = {
			parent: dataTypeTemplates,
			reference: doTypeReference,
			node: clonedDoType
		}
		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: edit
		})

		// Collect referenced DAType and EnumType IDs
		const dataAttributes = doTypeNode.querySelectorAll('DA, BDA')
		for (const da of dataAttributes) {
			const type = da.getAttribute('type')
			const bType = da.getAttribute('bType')

			// If type is specified and bType is 'Struct', it references a DAType
			if (type && bType === 'Struct') {
				daTypeIdsToCopy.add(type)
			}
			// If bType is 'Enum', type references an EnumType
			else if (type && bType === 'Enum') {
				enumTypeIdsToCopy.add(type)
			}
		}
	}

	// Copy DATypes and their nested dependencies
	copyDaTypes(Array.from(daTypeIdsToCopy), scd, dataTypeTemplates)

	// Copy EnumTypes
	copyEnumTypes(Array.from(enumTypeIdsToCopy), scd, dataTypeTemplates)
}

/**
 * Recursively copies DATypes and their dependent DATypes and EnumTypes.
 */
function copyDaTypes(
	daTypeIds: string[],
	scd: XMLDocument,
	dataTypeTemplates: Element
): void {
	const nestedDaTypeIds = new Set<string>()
	const enumTypeIdsToCopy = new Set<string>()

	for (const daTypeId of daTypeIds) {
		// Skip if DAType already exists
		if (scd.querySelector(`DAType[id="${daTypeId}"]`)) {
			continue
		}

		// Find DAType in SSD
		const daTypeNode = ssdImportStore.loadedSSDDocument?.querySelector(
			`DAType[id="${daTypeId}"]`
		)
		if (!daTypeNode) {
			console.warn(`DAType with id="${daTypeId}" not found in SSD`)
			continue
		}

		// Clone and insert DAType
		const clonedDaType = daTypeNode.cloneNode(true) as Element
		const daTypeReference = getReferenceForDaType(dataTypeTemplates)
		const edit: Insert = {
			parent: dataTypeTemplates,
			reference: daTypeReference,
			node: clonedDaType
		}
		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: edit
		})

		// Collect nested DAType and EnumType references
		const dataAttributes = daTypeNode.querySelectorAll('BDA')
		for (const bda of dataAttributes) {
			const type = bda.getAttribute('type')
			const bType = bda.getAttribute('bType')

			if (type && bType === 'Struct') {
				nestedDaTypeIds.add(type)
			} else if (type && bType === 'Enum') {
				enumTypeIdsToCopy.add(type)
			}
		}
	}

	// Recursively copy nested DATypes
	if (nestedDaTypeIds.size > 0) {
		copyDaTypes(Array.from(nestedDaTypeIds), scd, dataTypeTemplates)
	}

	// Copy EnumTypes
	copyEnumTypes(Array.from(enumTypeIdsToCopy), scd, dataTypeTemplates)
}

/**
 * Copies EnumTypes from SSD to SCD.
 */
function copyEnumTypes(
	enumTypeIds: string[],
	scd: XMLDocument,
	dataTypeTemplates: Element
): void {
	for (const enumTypeId of enumTypeIds) {
		// Skip if EnumType already exists
		if (scd.querySelector(`EnumType[id="${enumTypeId}"]`)) {
			continue
		}

		// Find EnumType in SSD
		const enumTypeNode = ssdImportStore.loadedSSDDocument?.querySelector(
			`EnumType[id="${enumTypeId}"]`
		)
		if (!enumTypeNode) {
			console.warn(`EnumType with id="${enumTypeId}" not found in SSD`)
			continue
		}

		// Clone and insert EnumType
		const clonedEnumType = enumTypeNode.cloneNode(true) as Element
		const enumTypeReference = getReferenceForEnumType(dataTypeTemplates)
		const edit: Insert = {
			parent: dataTypeTemplates,
			reference: enumTypeReference,
			node: clonedEnumType
		}
		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: edit
		})
	}
}

/**
 * Gets or creates the DataTypeTemplates element in the SCD document.
 */
function getOrCreateDataTypeTemplate(): Element {
	const doc = pluginGlobalStore.xmlDocument
	if (!doc) {
		throw new Error('No XML document loaded')
	}

	// Check if DataTypeTemplates exists
	let dataTypeTemplates = doc.querySelector('DataTypeTemplates')
	if (!dataTypeTemplates) {
		// Create DataTypeTemplates element
		dataTypeTemplates = doc.createElement('DataTypeTemplates')
		doc.documentElement.insertBefore(
			dataTypeTemplates,
			doc.documentElement.firstChild
		)
	}

	return dataTypeTemplates
}

/**
 * Determines the reference node for inserting a new LNodeType.
 * Returns the node after which the new LNodeType should be inserted.
 * If no LNodeTypes exist, returns the first child to insert before it.
 */
function getReferenceForLNodeType(dataTypeTemplates: Element): Node | null {
	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	if (lnodeTypes.length > 0) {
		// Place after the last existing LNodeType
		return lnodeTypes[lnodeTypes.length - 1].nextSibling
	}

	// No LNodeType present: place before the first child
	return dataTypeTemplates.firstChild
}

/**
 * Determines the reference node for inserting a new DOType.
 * Returns the node after which the new DOType should be inserted.
 * If no DOTypes exist, places after the last LNodeType or at the appropriate position.
 */
function getReferenceForDoType(dataTypeTemplates: Element): Node | null {
	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		// Place after the last existing DOType
		return doTypes[doTypes.length - 1].nextSibling
	}

	// No DOType present: place after last LNodeType if exists
	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	if (lnodeTypes.length > 0) {
		return lnodeTypes[lnodeTypes.length - 1].nextSibling
	}

	// Place before first child
	return dataTypeTemplates.firstChild
}

/**
 * Determines the reference node for inserting a new DAType.
 * Returns the node after which the new DAType should be inserted.
 * If no DATypes exist, places after the last DOType or at the appropriate position.
 */
function getReferenceForDaType(dataTypeTemplates: Element): Node | null {
	const daTypes = Array.from(dataTypeTemplates.querySelectorAll('DAType'))
	if (daTypes.length > 0) {
		// Place after the last existing DAType
		return daTypes[daTypes.length - 1].nextSibling
	}

	// No DAType present: place after last DOType if exists
	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	// Place after last LNodeType if exists
	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	if (lnodeTypes.length > 0) {
		return lnodeTypes[lnodeTypes.length - 1].nextSibling
	}

	// Place before first child
	return dataTypeTemplates.firstChild
}

/**
 * Determines the reference node for inserting a new EnumType.
 * Returns the node after which the new EnumType should be inserted.
 * If no EnumTypes exist, places after the last DAType or at the appropriate position.
 */
function getReferenceForEnumType(dataTypeTemplates: Element): Node | null {
	const enumTypes = Array.from(dataTypeTemplates.querySelectorAll('EnumType'))
	if (enumTypes.length > 0) {
		// Place after the last existing EnumType
		return enumTypes[enumTypes.length - 1].nextSibling
	}

	// No EnumType present: place after last DAType if exists
	const daTypes = Array.from(dataTypeTemplates.querySelectorAll('DAType'))
	if (daTypes.length > 0) {
		return daTypes[daTypes.length - 1].nextSibling
	}

	// Place after last DOType if exists
	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	// Place after last LNodeType if exists
	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	if (lnodeTypes.length > 0) {
		return lnodeTypes[lnodeTypes.length - 1].nextSibling
	}

	// Place before first child
	return dataTypeTemplates.firstChild
}
