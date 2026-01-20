import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { ConductingEquipmentTemplate, EqFunctionTemplate } from '../../types'
import { bayTypesStore, ssdImportStore } from '../../stores'
import { getBayElement } from '../utils/document-helpers'

/**
 * Creates a ConductingEquipment element with all required attributes
 * @param doc The XML document
 * @param conductingEquipmentTemplate The conducting equipment template from SSD
 * @param templateUuid The UUID from the bay type
 * @returns The created ConductingEquipment element
 */
export function createConductingEquipmentElement(
	doc: Document,
	conductingEquipmentTemplate: ConductingEquipmentTemplate,
	templateUuid: string
): Element {
	const ceElement = doc.createElement('ConductingEquipment')
	ceElement.setAttribute('name', conductingEquipmentTemplate.name)
	ceElement.setAttribute('type', conductingEquipmentTemplate.type)
	
	if (conductingEquipmentTemplate.desc) {
		ceElement.setAttribute('desc', conductingEquipmentTemplate.desc)
	}
	
	ceElement.setAttribute('templateUuid', templateUuid)
	ceElement.setAttribute('originUuid', conductingEquipmentTemplate.uuid)
	ceElement.setAttribute('uuid', uuidv4())

	return ceElement
}

/**
 * Finds the conducting equipment in the bay type that matches the template
 * @param conductingEquipmentTemplate The conducting equipment template from SSD
 * @throws Error if conducting equipment not found in bay type
 * @returns The UUID of the conducting equipment in the bay type
 */
export function getConductingEquipmentTemplateUuidFromBayType(
	conductingEquipmentTemplate: ConductingEquipmentTemplate
): string {
	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.name === bayTypesStore.selectedBayType
	)

	if (!bayType) {
		throw new Error(`Bay type ${bayTypesStore.selectedBayType} not found`)
	}

	const ceInTemplateBay = bayType.conductingEquipments.find(
		(ce) => ce.templateUuid === conductingEquipmentTemplate.uuid
	)

	if (!ceInTemplateBay) {
		throw new Error(
			`ConductingEquipment template with UUID ${conductingEquipmentTemplate.uuid} not found in bay type ${bayType.name}`
		)
	}

	return ceInTemplateBay.uuid
}

/**
 * Gets the reference element for inserting a ConductingEquipment in a Bay
 * ConductingEquipment should be inserted before Function or ConnectivityNode
 * @param bayElement The bay element
 * @returns The reference element or null
 */
export function getConductingEquipmentInsertionReference(bayElement: Element): Node | null {
	// Insert before first Function if it exists
	const firstFunction = bayElement.querySelector('Function')
	if (firstFunction) {
		return firstFunction
	}
	
	// Otherwise insert before first ConnectivityNode
	return bayElement.querySelector('ConnectivityNode')
}

/**
 * Checks if a conducting equipment already exists in the bay
 * @param doc The XML document
 * @param conductingEquipmentTemplate The conducting equipment template
 * @param bayName The bay name
 * @returns True if conducting equipment exists, false otherwise
 */
export function conductingEquipmentExistsInBay(
	doc: Document,
	conductingEquipmentTemplate: ConductingEquipmentTemplate,
	bayName: string
): boolean {
	const bayElement = getBayElement(doc, bayName)
	const existingCE = bayElement.querySelector(
		`ConductingEquipment[name="${conductingEquipmentTemplate.name}"]`
	)
	return existingCE !== null
}

/**
 * Creates an Insert edit for adding a ConductingEquipment to a Bay
 * @param doc The XML document
 * @param conductingEquipmentTemplate The conducting equipment template from SSD
 * @param bayName The name of the bay to add the conducting equipment to
 * @returns The Insert edit for adding the conducting equipment, or null if it already exists
 */
export function createConductingEquipmentInsertEdit(
	doc: Document,
	conductingEquipmentTemplate: ConductingEquipmentTemplate,
	bayName: string
): Insert | null {
	if (conductingEquipmentExistsInBay(doc, conductingEquipmentTemplate, bayName)) {
		return null
	}

	const bayElement = getBayElement(doc, bayName)
	const templateUuid = getConductingEquipmentTemplateUuidFromBayType(conductingEquipmentTemplate)
	const ceElement = createConductingEquipmentElement(doc, conductingEquipmentTemplate, templateUuid)
	const reference = getConductingEquipmentInsertionReference(bayElement)

	return {
		parent: bayElement,
		reference: reference,
		node: ceElement
	}
}
