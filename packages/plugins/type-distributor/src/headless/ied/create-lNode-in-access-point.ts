import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert } from '@openscd/oscd-api'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '../common-types'
import {
	createLNodeElementInIED,
	createServerElementWithAuth,
	getExistingServer,
	getOrCreateLDeviceElement,
	hasLNode
} from './elements'

type CreateLNodesParams = {
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	lNodes: LNodeTemplate[]
	iedName: string
	accessPoint: Element
}

type CreateLNodeParams = {
	lNode: LNodeTemplate
	lDevice: Element
	doc: XMLDocument
}

function ensureServer(
	accessPoint: Element,
	doc: XMLDocument
): { serverElement: Element; edit: Insert | undefined } {
	const existingServer = getExistingServer(accessPoint)
	if (existingServer) {
		return { serverElement: existingServer, edit: undefined }
	}

	const serverElement = createServerElementWithAuth(doc)
	accessPoint.appendChild(serverElement)

	const edit: Insert = {
		node: serverElement,
		parent: accessPoint,
		reference: null
	}

	return { serverElement, edit }
}

function ensureLDevice(
	server: Element,
	doc: XMLDocument,
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
): { lDevice: Element; edit: Insert } {
	const lDevice = getOrCreateLDeviceElement(doc, sourceFunction, server)

	const edit: Insert = {
		node: lDevice,
		parent: server,
		reference: null
	}

	return { lDevice, edit }
}

function createLNodeInAccessPoint({
	lNode,
	lDevice,
	doc
}: CreateLNodeParams): Insert | undefined {
	if (hasLNode(lDevice, lNode)) {
		console.warn(
			`[createLNodesInAccessPoint] LN ${lNode.lnClass}:${lNode.lnType}:${lNode.lnInst} already exists in LDevice`
		)
		return
	}

	const lNodeElement = createLNodeElementInIED(lNode, doc)

	try {
		const edit: Insert = {
			node: lNodeElement,
			parent: lDevice,
			reference: null
		}

		return edit
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
}: CreateLNodesParams): Insert[] {
	const edits: Insert[] = []

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}

	const doc = pluginGlobalStore.xmlDocument
	const { serverElement, edit: serverEdit } = ensureServer(accessPoint, doc)
	const { lDevice, edit: lDeviceEdit } = ensureLDevice(
		serverElement,
		doc,
		sourceFunction
	)
	if (serverEdit) edits.push(serverEdit)
	edits.push(lDeviceEdit)

	for (const lNode of lNodes) {
		const lNodeEdit = createLNodeInAccessPoint({
			lNode,
			lDevice,
			doc
		})
		if (lNodeEdit) {
			edits.push(lNodeEdit)
		}
	}

	return edits
}
