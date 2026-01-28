import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert } from '@openscd/oscd-api'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '../types'
import type { XMLEditor } from '@openscd/oscd-editor'
import {
	createLNodeElement,
	getOrCreateLDeviceElement,
	getOrCreateServerElement
} from '../elements'

type CreateLNodesParams = {
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	lNodes: LNodeTemplate[]
	iedName: string
	accessPoint: Element
}

type CreateLNodeParams = {
	lNode: LNodeTemplate
	lDevice: Element
	iedName: string
	doc: XMLDocument
	editor: XMLEditor
}

function ensureServer(
	accessPoint: Element,
	doc: XMLDocument,
	editor: XMLEditor
): Element {
	const serverElement = getOrCreateServerElement(doc, accessPoint)

	const edit: Insert = {
		node: serverElement,
		parent: accessPoint,
		reference: null
	}

	editor.commit(edit, {
		title: 'Add Server element'
	})

	return serverElement
}

function ensureLDevice(
	server: Element,
	doc: XMLDocument,
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	editor: XMLEditor
): Element {
	const lDevice = getOrCreateLDeviceElement(doc, sourceFunction, server)

	const edit: Insert = {
		node: lDevice,
		parent: server,
		reference: null
	}

	editor.commit(edit, {
		title: `Add LDevice ${lDevice.getAttribute('inst')} to Server`
	})

	return lDevice
}

function createLNodeInAccessPoint({
	lNode,
	lDevice,
	iedName,
	doc,
	editor
}: CreateLNodeParams): void {
	const lNodeElement = createLNodeElement(lNode, iedName, doc)

	try {
		const edit: Insert = {
			node: lNodeElement,
			parent: lDevice,
			reference: null
		}

		editor.commit(edit, {
			title: `Add LN ${lNode.lnClass} to ${iedName}`
		})
	} catch (error) {
		console.error(
			'[createLNodesInAccessPoint] Error dispatching edit event:',
			error
		)
		throw error
	}
}

export function createLNodesInAccessPoint({
	sourceFunction,
	lNodes,
	iedName,
	accessPoint
}: CreateLNodesParams): void {
	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}

	const doc = pluginGlobalStore.xmlDocument
	const server = ensureServer(accessPoint, doc, editor)
	const lDevice = ensureLDevice(server, doc, sourceFunction, editor)

	for (const lNode of lNodes) {
		createLNodeInAccessPoint({ lNode, lDevice, iedName, doc, editor })
	}
}
