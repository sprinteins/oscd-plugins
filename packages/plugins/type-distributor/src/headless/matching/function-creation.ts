import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { BayType } from '../types'
import { ssdImportStore } from '../stores'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'
import { createLNodeElement } from './eqfunction-creation'

/**
 * Creates Function elements from BayType and inserts them into Bay
 */
export function createFunctionInsertEdits(
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

		const functionElement = scdBay.namespaceURI
			? doc.createElementNS(scdBay.namespaceURI, 'Function')
			: doc.createElement('Function')
		functionElement.setAttribute('name', functionTemplate.name)
		functionElement.setAttribute('uuid', uuidv4())
		functionElement.setAttribute('templateUuid', functionType.uuid)
		functionElement.setAttribute('originUuid', functionTemplate.uuid)

		if (functionTemplate.desc) {
			functionElement.setAttribute('desc', functionTemplate.desc)
		}

		// Copy LNodes from the Function template
		for (const lnodeTemplate of functionTemplate.lnodes) {
			const lnodeElement = createLNodeElement(
				doc,
				lnodeTemplate,
				scdBay.namespaceURI
			)
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
