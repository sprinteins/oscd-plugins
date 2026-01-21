import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { LNodeTemplate } from '../types'
import type { EquipmentMatch } from './matching'

/**
 * Creates EqFunction elements from TEMPLATE and inserts them into equipment.
 * EqFunction elements only have uuid attribute (no templateUuid/originUuid).
 */
export function createEqFunctionInsertEdits(
	doc: Document,
	matches: EquipmentMatch[]
): Insert[] {
	const inserts: Insert[] = []

	for (const match of matches) {
		// Get the template equipment using originUuid
		const templateEquipment = match.templateEquipment

		// Copy each EqFunction from the template
		for (const eqFunctionTemplate of templateEquipment.eqFunctions) {
			const eqFunctionElement = doc.createElementNS(
				match.scdElement.namespaceURI,
				'EqFunction'
			)
			eqFunctionElement.setAttribute('name', eqFunctionTemplate.name)
			eqFunctionElement.setAttribute('uuid', uuidv4())

			// Copy LNodes from the EqFunction template
			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				const lnodeElement = createLNodeElement(
					doc,
					lnodeTemplate,
					match.scdElement.namespaceURI
				)
				eqFunctionElement.appendChild(lnodeElement)
			}

			// Insert EqFunction into the SCD equipment
			// Insert AFTER all Terminal elements
			const terminals = Array.from(
				match.scdElement.querySelectorAll('Terminal')
			)
			const referenceNode =
				terminals.length > 0
					? terminals[terminals.length - 1].nextSibling
					: null

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
export function createLNodeElement(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	namespaceURI: string | null = null
): Element {
	const lnodeElement = namespaceURI
		? doc.createElementNS(namespaceURI, 'LNode')
		: doc.createElement('LNode')
	lnodeElement.setAttribute('uuid', uuidv4())
	lnodeElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lnodeElement.setAttribute('lnInst', lnodeTemplate.lnInst)
	lnodeElement.setAttribute('lnType', lnodeTemplate.lnType)

	if (lnodeTemplate.iedName) {
		lnodeElement.setAttribute('iedName', lnodeTemplate.iedName)
	}

	// Note: ldInst and prefix are typically set during assignment to AccessPoint

	return lnodeElement
}
