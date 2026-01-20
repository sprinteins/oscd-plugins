import { v4 as uuidv4 } from 'uuid'
import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type {
	BayType,
	ConductingEquipmentType,
	ConductingEquipmentTemplate,
	EqFunctionTemplate,
	FunctionType,
	FunctionTemplate,
	LNodeTemplate
} from '../types'
import { ssdImportStore, bayTypesStore } from '../stores'
import { getDocumentAndEditor, getBayElement } from '../distribution/utils/document-helpers'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'

type EquipmentMatch = {
	scdElement: Element
	bayTypeEquipment: ConductingEquipmentType
	templateEquipment: ConductingEquipmentTemplate
}

type ValidationResult = {
	isValid: boolean
	errors: string[]
}

/**
 * Validates that SCD Bay and BayType have matching equipment counts and types
 */
function validateEquipmentMatch(
	scdBay: Element,
	bayType: BayType
): ValidationResult {
	const errors: string[] = []

	// Extract equipment from SCD Bay
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)
	const scdGeneralEquipment = Array.from(
		scdBay.querySelectorAll('GeneralEquipment')
	)

	// Group SCD equipment by type
	const scdCEByType = groupByType(scdConductingEquipment)
	const scdGEByType = groupByType(scdGeneralEquipment)

	// Get BayType equipment templates
	const bayTypeCETemplates = bayType.conductingEquipments
		.map((ce) => ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid))
		.filter((t): t is ConductingEquipmentTemplate => t != null)

	// Group BayType equipment by type
	const bayTypeCEByType = groupTemplatesByType(bayTypeCETemplates)

	// Validate ConductingEquipment counts
	for (const [type, scdElements] of Object.entries(scdCEByType)) {
		const bayTypeElements = bayTypeCEByType[type] || []
		if (scdElements.length !== bayTypeElements.length) {
			errors.push(
				`ConductingEquipment type "${type}": SCD has ${scdElements.length}, BayType has ${bayTypeElements.length}`
			)
		}
	}

	// Check for missing types in SCD
	for (const [type, bayTypeElements] of Object.entries(bayTypeCEByType)) {
		if (!scdCEByType[type]) {
			errors.push(
				`ConductingEquipment type "${type}": Missing in SCD (BayType has ${bayTypeElements.length})`
			)
		}
	}

	// TODO: Add GeneralEquipment validation when needed

	return {
		isValid: errors.length === 0,
		errors
	}
}

/**
 * Groups equipment elements by their type attribute
 */
function groupByType(elements: Element[]): Record<string, Element[]> {
	const grouped: Record<string, Element[]> = {}
	for (const element of elements) {
		const type = element.getAttribute('type')
		if (type) {
			if (!grouped[type]) {
				grouped[type] = []
			}
			grouped[type].push(element)
		}
	}
	return grouped
}

/**
 * Groups equipment templates by their type attribute
 */
function groupTemplatesByType(
	templates: ConductingEquipmentTemplate[]
): Record<string, ConductingEquipmentTemplate[]> {
	const grouped: Record<string, ConductingEquipmentTemplate[]> = {}
	for (const template of templates) {
		if (!grouped[template.type]) {
			grouped[template.type] = []
		}
		grouped[template.type].push(template)
	}
	return grouped
}

/**
 * Matches SCD equipment to BayType equipment sequentially by type
 * For duplicate types (e.g., multiple "DIS"), matches in order: 1st->1st, 2nd->2nd, etc.
 */
function matchEquipmentSequentially(
	scdBay: Element,
	bayType: BayType
): EquipmentMatch[] {
	const matches: EquipmentMatch[] = []

	// Get SCD equipment
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	// Build mapping of BayType equipment to templates
	const bayTypeEquipmentMap = new Map<string, {
		bayTypeEquipment: ConductingEquipmentType
		template: ConductingEquipmentTemplate
	}>()

	for (const bayTypeEquipment of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(
			bayTypeEquipment.templateUuid
		)
		if (template) {
			bayTypeEquipmentMap.set(bayTypeEquipment.uuid, {
				bayTypeEquipment,
				template
			})
		}
	}

	// Group SCD and BayType equipment by type for sequential matching
	const scdByType = groupByType(scdConductingEquipment)
	const bayTypeByType: Record<string, ConductingEquipmentType[]> = {}

	for (const [uuid, { bayTypeEquipment, template }] of bayTypeEquipmentMap) {
		const type = template.type
		if (!bayTypeByType[type]) {
			bayTypeByType[type] = []
		}
		bayTypeByType[type].push(bayTypeEquipment)
	}

	// Match sequentially: 1st SCD element of type X -> 1st BayType element of type X
	for (const [type, scdElements] of Object.entries(scdByType)) {
		const bayTypeElements = bayTypeByType[type] || []

		for (let i = 0; i < scdElements.length; i++) {
			const scdElement = scdElements[i]
			const bayTypeEquipment = bayTypeElements[i]

			if (bayTypeEquipment) {
				const mapping = bayTypeEquipmentMap.get(bayTypeEquipment.uuid)
				if (mapping) {
					matches.push({
						scdElement,
						bayTypeEquipment: mapping.bayTypeEquipment,
						templateEquipment: mapping.template
					})
				}
			}
		}
	}

	return matches
}

/**
 * Creates SetAttributes edits to add UUID attributes to equipment and Bay
 */
function createEquipmentUpdateEdits(
	matches: EquipmentMatch[],
	scdBay: Element,
	bayType: BayType
): SetAttributes[] {
	const updates: SetAttributes[] = []

	// Update each matched equipment
	for (const match of matches) {
		updates.push({
			element: match.scdElement,
			attributes: {
				uuid: uuidv4(),
				templateUuid: match.bayTypeEquipment.uuid,
				originUuid: match.templateEquipment.uuid
			}
		})
	}

	// Update Bay element with templateUuid and originUuid
	// The Bay's templateUuid points to the selected BayType
	// The Bay's originUuid points to the TEMPLATE Bay (if BayType has one)
	const bayTypeTemplateBay = ssdImportStore.bayTypes.find(
		(bay) => bay.name === 'TEMPLATE'
	)

	updates.push({
		element: scdBay,
		attributes: {
			uuid: scdBay.getAttribute('uuid') || uuidv4(), // Preserve existing or create new
			templateUuid: bayType.uuid,
			originUuid: bayTypeTemplateBay?.uuid || bayType.uuid // Fallback to bayType if no TEMPLATE
		}
	})

	return updates
}

/**
 * Creates EqFunction elements from TEMPLATE and inserts them into equipment
 */
function createEqFunctionInsertEdits(
	doc: Document,
	matches: EquipmentMatch[]
): Insert[] {
	const inserts: Insert[] = []

	for (const match of matches) {
		// Get the template equipment using originUuid
		const templateEquipment = match.templateEquipment

		// Copy each EqFunction from the template
		for (const eqFunctionTemplate of templateEquipment.eqFunctions) {
			const eqFunctionElement = doc.createElement('EqFunction')
			eqFunctionElement.setAttribute('name', eqFunctionTemplate.name)
			eqFunctionElement.setAttribute('uuid', uuidv4())

			if (eqFunctionTemplate.desc) {
				eqFunctionElement.setAttribute('desc', eqFunctionTemplate.desc)
			}

			// Copy LNodes from the EqFunction template
			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				const lnodeElement = createLNodeElement(doc, lnodeTemplate)
				eqFunctionElement.appendChild(lnodeElement)
			}

			// Insert EqFunction into the SCD equipment
			// Insert before Terminal elements if they exist
			const referenceNode = match.scdElement.querySelector('Terminal')

			inserts.push({
				parent: match.scdElement,
				node: eqFunctionElement,
				reference: referenceNode
			})
		}
	}

	return inserts
}

/**
 * Creates an LNode element with a new UUID
 */
function createLNodeElement(doc: Document, lnodeTemplate: LNodeTemplate): Element {
	const lnodeElement = doc.createElement('LNode')
	lnodeElement.setAttribute('uuid', uuidv4())
	lnodeElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lnodeElement.setAttribute('lnInst', lnodeTemplate.lnInst)

	if (lnodeTemplate.iedName) {
		lnodeElement.setAttribute('iedName', lnodeTemplate.iedName)
	}

	// Note: lnType is not an attribute on LNode, it's used to copy DataTypeTemplates
	// ldInst and prefix are typically set during assignment to AccessPoint

	return lnodeElement
}

/**
 * Creates Function elements from BayType and inserts them into Bay
 */
function createFunctionInsertEdits(
	doc: Document,
	bayType: BayType,
	scdBay: Element
): Insert[] {
	const inserts: Insert[] = []

	for (const functionType of bayType.functions) {
		// Get the function template from TEMPLATE section
		const functionTemplate = ssdImportStore.getFunctionTemplate(
			functionType.templateUuid
		)

		if (!functionTemplate) {
			console.warn(
				`Function template ${functionType.templateUuid} not found`
			)
			continue
		}

		const functionElement = doc.createElement('Function')
		functionElement.setAttribute('name', functionTemplate.name)
		functionElement.setAttribute('uuid', uuidv4())
		functionElement.setAttribute('templateUuid', functionType.uuid)
		functionElement.setAttribute('originUuid', functionTemplate.uuid)

		if (functionTemplate.desc) {
			functionElement.setAttribute('desc', functionTemplate.desc)
		}

		// Copy LNodes from the Function template
		for (const lnodeTemplate of functionTemplate.lnodes) {
			const lnodeElement = createLNodeElement(doc, lnodeTemplate)
			functionElement.appendChild(lnodeElement)

			// Copy DataTypeTemplates for this LNode
			copyRelevantDataTypeTemplates(lnodeTemplate)
		}

		// Insert Function before ConnectivityNode elements if they exist
		const referenceNode = scdBay.querySelector('ConnectivityNode')

		inserts.push({
			parent: scdBay,
			node: functionElement,
			reference: referenceNode
		})
	}

	return inserts
}

/**
 * Main function: Assigns a BayType to an SCD Bay
 * Validates equipment match, creates UUID relationships, copies EqFunctions and Functions
 * All changes are committed as a single atomic operation
 * 
 * @param bayName The name of the Bay in the SCD to update
 * @throws Error if validation fails or required data is missing
 */
export function onSelectBayType(bayName: string): void {
	const { doc, editor } = getDocumentAndEditor()

	// Get selected BayType
	const selectedBayTypeName = bayTypesStore.selectedBayType
	if (!selectedBayTypeName) {
		throw new Error('No BayType selected')
	}

	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.name === selectedBayTypeName
	)

	if (!bayType) {
		throw new Error(`BayType "${selectedBayTypeName}" not found`)
	}

	// Get SCD Bay element
	const scdBay = getBayElement(doc, bayName)

	// Step 1: Validate equipment match
	const validation = validateEquipmentMatch(scdBay, bayType)
	if (!validation.isValid) {
		throw new Error(
			`Equipment validation failed:\n${validation.errors.join('\n')}`
		)
	}

	// Step 2: Match equipment sequentially
	const matches = matchEquipmentSequentially(scdBay, bayType)

	// Collect all edits
	const edits: (Insert | SetAttributes)[] = []

	// Step 3: Create UUID update edits for equipment and Bay
	const updateEdits = createEquipmentUpdateEdits(matches, scdBay, bayType)
	edits.push(...updateEdits)

	// Step 4: Create EqFunction insert edits
	const eqFunctionEdits = createEqFunctionInsertEdits(doc, matches)
	edits.push(...eqFunctionEdits)

	// Step 5: Create Function insert edits and copy DataTypeTemplates
	const functionEdits = createFunctionInsertEdits(doc, bayType, scdBay)
	edits.push(...functionEdits)

	// Copy DataTypeTemplates for EqFunction LNodes as well
	for (const match of matches) {
		for (const eqFunctionTemplate of match.templateEquipment.eqFunctions) {
			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				copyRelevantDataTypeTemplates(lnodeTemplate)
			}
		}
	}

	// Commit all edits as a single atomic operation
	editor.commit(edits, {
		title: `Assign BayType "${selectedBayTypeName}" to Bay "${bayName}"`
	})
}



