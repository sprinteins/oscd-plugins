import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { BayType, FunctionTemplate } from '@/headless/common-types'
import { createElement } from '@oscd-plugins/core'
import { getFunctionTemplate } from '@/headless/domain/matching'
import { createLNodeElementInBay } from '@/headless/scl/elements/lnode-element'
import type { EquipmentMatch } from '@/headless/domain/matching'

interface BuildInsertEditsForFunctionParams {
	doc: Document
	bayType: BayType
	scdBay: Element
	functionTemplates: FunctionTemplate[]
}

export function buildInsertEditsForFunction({
	doc,
	bayType,
	scdBay,
	functionTemplates
}: BuildInsertEditsForFunctionParams): Insert[] {
	const inserts: Insert[] = []

	for (const functionType of bayType.functions) {
		const functionTemplate = getFunctionTemplate(
			functionTemplates,
			functionType.templateUuid
		)

		if (!functionTemplate) {
			console.warn(
				`Function template ${functionType.templateUuid} not found`
			)
			continue
		}

		const functionElement = createElement(doc, 'Function', {
			name: functionTemplate.name,
			uuid: uuidv4(),
			templateUuid: functionType.uuid,
			originUuid: functionTemplate.uuid,
			desc: functionTemplate.desc ?? null
		})

		for (const lnodeTemplate of functionTemplate.lnodes) {
			const lnodeElement = createLNodeElementInBay(doc, lnodeTemplate)
			functionElement.appendChild(lnodeElement)
		}

		const referenceNode = scdBay.querySelector('ConnectivityNode')

		inserts.push({
			parent: scdBay,
			node: functionElement,
			reference: referenceNode
		})
	}

	return inserts
}

export function buildInsertEditsForEqFunction(
	doc: Document,
	matches: EquipmentMatch[]
): Insert[] {
	const inserts: Insert[] = []

	for (const match of matches) {
		const templateEquipment = match.templateEquipment

		for (const eqFunctionTemplate of templateEquipment.eqFunctions) {
			const eqFunctionElement = createElement(doc, 'EqFunction', {
				name: eqFunctionTemplate.name,
				uuid: uuidv4()
			})

			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				const lnodeElement = createLNodeElementInBay(doc, lnodeTemplate)
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
