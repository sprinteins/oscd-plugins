import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { createLNodeElement } from './lnode-creation'

export function buildInsertEditsForEqFunction(
	doc: Document,
	matches: EquipmentMatch[]
): Insert[] {
	const inserts: Insert[] = []

	for (const match of matches) {
		const templateEquipment = match.templateEquipment

		for (const eqFunctionTemplate of templateEquipment.eqFunctions) {
			const eqFunctionElement = doc.createElement('EqFunction')
			eqFunctionElement.setAttribute('name', eqFunctionTemplate.name)
			eqFunctionElement.setAttribute('uuid', uuidv4())

			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				const lnodeElement = createLNodeElement(doc, lnodeTemplate)
				eqFunctionElement.appendChild(lnodeElement)
			}

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
