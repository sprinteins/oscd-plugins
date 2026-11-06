import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { v4 as uuidv4 } from 'uuid'
import { getSchemaInsertBeforeReference } from './schema-insertion.helper'

export function setConductingEquipmentTerminalCount(params: {
	equipmentElement: Element
	value: number
}) {
	if (!pluginGlobalStore.host) throw new Error('Host not found')

	const terminalElements = Array.from(
		params.equipmentElement.children
	).filter((child) => child.localName === 'Terminal')

	if (params.value === 1 && terminalElements.length === 2)
		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				node: terminalElements[1]
			}
		})

	if (params.value === 2 && terminalElements.length === 1) {
		const clonedTerminal = terminalElements[0].cloneNode(false) as Element
		clonedTerminal.setAttribute('uuid', uuidv4())

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				parent: params.equipmentElement,
				node: clonedTerminal,
				reference: getSchemaInsertBeforeReference({
					elementName: 'Terminal',
					parentTypeWrapper: params.equipmentElement
				})
			}
		})
	}
}
