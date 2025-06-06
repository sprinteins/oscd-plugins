import { tick } from 'svelte'
// CORE
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import { L_NODE_TYPE_CONTENT } from '@/headless/constants'
// STORES
import { pluginLocalStore, logicalStore } from '@/headless/stores'
// TYPES
import type {
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

async function createDataTypeTemplates() {
	if (!pluginGlobalStore.xmlDocument) throw new Error('no xml document found')
	if (!pluginGlobalStore.host) throw new Error('no host element found')

	const { rootElement, rootSubElements } = pluginLocalStore

	if (rootSubElements.dataTypeTemplates) return

	const dataTypeTemplates =
		pluginGlobalStore.xmlDocument.createElement('DataTypeTemplates')
	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: dataTypeTemplates,
			parent: rootElement,
			reference: null
		}
	})
}

export async function createRequiredLNodeType(
	logicalType: LogicalConditionerClass | LogicalPhysicalClass
) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('no xml document found')
	if (!pluginGlobalStore.host) throw new Error('no host element found')

	createDataTypeTemplates()
	await tick()

	if (logicalStore.hasLNodeTypeOfClass(logicalType)) return

	const dataTypeTemplates = pluginLocalStore.rootSubElements.dataTypeTemplates
	if (!dataTypeTemplates)
		throw new Error('no dataTypeTemplates element found')

	const attributes = {
		id: `IOCenter.${logicalType}`,
		lnClass: logicalType
	}

	pluginLocalStore.createElement({
		tagName: 'LNodeType',
		attributes,
		parent: dataTypeTemplates,
		innerHTML: L_NODE_TYPE_CONTENT[logicalType]
	})
}
