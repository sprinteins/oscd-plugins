import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { BayType } from '../../common-types'
import { ssdImportStore } from '../../stores/ssd-import.store.svelte'
import { createElement } from '@oscd-plugins/core'
import { createLNodeElement } from './lnode-creation'

export function buildInsertEditsForFunction(
	doc: Document,
	bayType: BayType,
	scdBay: Element
): Insert[] {
	const inserts: Insert[] = []

	for (const functionType of bayType.functions) {
		const functionTemplate = ssdImportStore.getFunctionTemplate(
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
			const lnodeElement = createLNodeElement(
				doc,
				lnodeTemplate
			)
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
