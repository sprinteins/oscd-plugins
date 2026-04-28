import type { Insert } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import { v4 as uuidv4 } from 'uuid'
import type { BayType, GeneralEquipmentTemplate } from '@/headless/common-types'
import { uuidToPrefix } from '@/headless/scl/elements'
import { createLNodeElementInBay } from '@/headless/scl/elements/lnode-element'

function generateUniquePrefixUuid(existingPrefixes: Set<string>): string {
	for (let i = 0; i < 1000; i++) {
		const uuid = uuidv4()
		if (!existingPrefixes.has(uuidToPrefix(uuid))) return uuid
	}
	throw new Error('Unable to generate unique UUID after 1000 attempts')
}

interface BuildInsertsForGeneralEquipmentParams {
	doc: Document
	bayType: BayType
	scdBay: Element
	generalEquipmentTemplates: GeneralEquipmentTemplate[]
	existingPrefixes: Set<string>
}

export function buildInsertsForGeneralEquipment({
	doc,
	bayType,
	scdBay,
	generalEquipmentTemplates,
	existingPrefixes
}: BuildInsertsForGeneralEquipmentParams): Insert[] {
	const inserts: Insert[] = []

	for (const generalEquipmentType of bayType.generalEquipments) {
		const geTemplate = generalEquipmentTemplates.find(
			(t) => t.uuid === generalEquipmentType.templateUuid
		)

		if (!geTemplate) {
			console.warn(
				`GeneralEquipment template ${generalEquipmentType.templateUuid} not found`
			)
			continue
		}

		const geUuid = generateUniquePrefixUuid(existingPrefixes)
		existingPrefixes.add(uuidToPrefix(geUuid))

		const geElement = createElement(doc, 'GeneralEquipment', {
			name: geTemplate.name,
			type: geTemplate.type,
			uuid: geUuid,
			templateUuid: generalEquipmentType.uuid,
			originUuid: geTemplate.uuid,
			desc: geTemplate.desc ?? null,
			virtual: generalEquipmentType.virtual ? 'true' : null
		})

		for (const eqFunctionTemplate of geTemplate.eqFunctions) {
			const eqFunctionUuid = generateUniquePrefixUuid(existingPrefixes)
			existingPrefixes.add(uuidToPrefix(eqFunctionUuid))

			const eqFunctionElement = createElement(doc, 'EqFunction', {
				name: eqFunctionTemplate.name,
				uuid: eqFunctionUuid
			})

			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				const lnodeElement = createLNodeElementInBay(doc, lnodeTemplate)
				eqFunctionElement.appendChild(lnodeElement)
			}

			geElement.appendChild(eqFunctionElement)
		}

		const referenceNode = scdBay.querySelector('ConnectivityNode')

		inserts.push({
			parent: scdBay,
			node: geElement,
			reference: referenceNode
		})
	}

	return inserts
}
