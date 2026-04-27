import type { Insert, Remove } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import { v4 as uuidv4 } from 'uuid'
import type { BayType, FunctionTemplate } from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { getFunctionTemplate } from '@/headless/domain/matching'
import { uuidToPrefix } from '@/headless/scl/elements'
import { createLNodeElementInBay } from '@/headless/scl/elements/lnode-element'

function generateUniquePrefixUuid(existingPrefixes: Set<string>): string {
	for (let i = 0; i < 1000; i++) {
		const uuid = uuidv4()
		if (!existingPrefixes.has(uuidToPrefix(uuid))) return uuid
	}
	throw new Error('Unable to generate unique UUID after 1000 attempts')
}

export function collectExistingPrefixes(
	elements: Iterable<Element>
): Set<string> {
	const prefixes = new Set<string>()
	for (const el of elements) {
		const uuid = el.getAttribute('uuid')
		if (uuid) prefixes.add(uuidToPrefix(uuid))
	}
	return prefixes
}

interface BuildInsertsForFunctionParams {
	doc: Document
	bayType: BayType
	scdBay: Element
	functionTemplates: FunctionTemplate[]
	existingPrefixes: Set<string>
}

export function buildInsertsForFunction({
	doc,
	bayType,
	scdBay,
	functionTemplates,
	existingPrefixes
}: BuildInsertsForFunctionParams): Insert[] {
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

		const functionUuid = generateUniquePrefixUuid(existingPrefixes)
		existingPrefixes.add(uuidToPrefix(functionUuid))

		const functionElement = createElement(doc, 'Function', {
			name: functionTemplate.name,
			uuid: functionUuid,
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

interface BuildInsertsForEqFunctionParams {
	doc: Document
	matches: EquipmentMatch[]
	prefixes: Set<string>
}

export function buildInsertsForEqFunction({
	doc,
	matches,
	prefixes
}: BuildInsertsForEqFunctionParams): Insert[] {
	const inserts: Insert[] = []

	for (const match of matches) {
		const templateEquipment = match.templateEquipment

		for (const eqFunctionTemplate of templateEquipment.eqFunctions) {
			const eqFunctionUuid = generateUniquePrefixUuid(prefixes)
			prefixes.add(uuidToPrefix(eqFunctionUuid))

			const eqFunctionElement = createElement(doc, 'EqFunction', {
				name: eqFunctionTemplate.name,
				uuid: eqFunctionUuid
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

export function buildRemovesForEqFunctions(match: EquipmentMatch): Remove[] {
	const eqFunctions = Array.from(
		match.scdElement.querySelectorAll(':scope > EqFunction')
	)
	return eqFunctions.map((eqFunction) => ({ node: eqFunction }) as Remove)
}
