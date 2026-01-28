import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert } from '@openscd/oscd-api'
import type { ConductingEquipmentTemplate, FunctionTemplate, LNodeTemplate } from '../types'
import type { XMLEditor } from '@openscd/oscd-editor'
import {
	createLNodeElement,
	createServerElementWithAuth,
	getExistingServer,
	getOrCreateLDeviceElement
} from '../elements'

type CreateLNodesParams = {
	accessPoint: Element
	lNodes: LNodeTemplate[]
	iedName: string
	lDeviceInst?: string
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
	const existingServer = getExistingServer(accessPoint)
	if (existingServer) {
		return existingServer
	}

	const serverElement = createServerElementWithAuth(doc)

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
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
	editor: XMLEditor
): Element {
	const lDevice = getOrCreateLDeviceElement(doc, functionFromSSD, server)

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

export function createLNodesInAccessPoint(
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
	lNodes: LNodeTemplate[],
	iedName: string,
	accessPoint: Element
): void {
	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}

	const doc = pluginGlobalStore.xmlDocument
	const server = ensureServer(accessPoint, doc, editor)
	const lDevice = ensureLDevice(server, doc, functionFromSSD, editor)

	for (const lNode of lNodes) {
		createLNodeInAccessPoint({ lNode, lDevice, iedName, doc, editor })
	}
}
