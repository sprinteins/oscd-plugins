import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { BayType } from '../../types'
import { ssdImportStore } from '../../stores'
import { createLNodeElement } from './lnode-creation'

export function createFunctionInsertEdits(
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

		const functionElement = doc.createElement('Function')
		functionElement.setAttribute('name', functionTemplate.name)
		functionElement.setAttribute('uuid', uuidv4())
		functionElement.setAttribute('templateUuid', functionType.uuid)
		functionElement.setAttribute('originUuid', functionTemplate.uuid)

		if (functionTemplate.desc) {
			functionElement.setAttribute('desc', functionTemplate.desc)
		}

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
