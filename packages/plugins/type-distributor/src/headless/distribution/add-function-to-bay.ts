import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { FunctionTemplate } from '../types'
import { bayTypesStore, ssdImportStore } from '../stores'
import { v4 as uuidv4 } from 'uuid'
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import type { Insert } from '@openscd/oscd-api'

export function addFunctionToBay(
	functionElementFromSSD: FunctionTemplate,
	bayName: string
): void {
	const doc = pluginGlobalStore.xmlDocument
	const host = pluginGlobalStore.host
	if (!doc || !host) {
		throw new Error('XML Document is not loaded')
	}

	const bayElement = doc.querySelector(`Bay[name="${bayName}"]`)
	if (!bayElement) {
		throw new Error(`Bay with name ${bayName} not found`)
	}

	const referenceMaybeConnectivityNode =
		bayElement.querySelector('ConnectivityNode')

	const functionElement = doc.createElement('Function')
	functionElement.setAttribute('name', functionElementFromSSD.name)
	functionElement.setAttribute('desc', functionElementFromSSD.desc || '')

	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.name === bayTypesStore.selectedBayType
	)

	const functionInTemplateBay = bayType?.functions.find(
		(func) => func.templateUuid === functionElementFromSSD.uuid
	)

	if (!functionInTemplateBay) {
		throw new Error(
			`Function template with UUID ${functionElementFromSSD.uuid} not found in bay type ${bayType?.name}`
		)
	}

	functionElement.setAttribute('templateUuid', functionInTemplateBay.uuid)
	functionElement.setAttribute('originUuid', functionElementFromSSD.uuid)
	functionElement.setAttribute('uuid', uuidv4())

	const edit: Insert = {
		parent: bayElement,
		reference: referenceMaybeConnectivityNode,
		node: functionElement
	}

	createAndDispatchEditEvent({
		host,
		edit: edit
	})
}
