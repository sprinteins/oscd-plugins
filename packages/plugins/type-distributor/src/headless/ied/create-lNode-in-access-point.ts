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
	getExistingLDevice,
	createLDeviceElement,
	hasLNodeInTargetDoc,
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
): { lDevice: Element; edit: Insert | undefined } {
	const existingLDevice = getExistingLDevice(server, sourceFunction)
	if (existingLDevice) {
		return { lDevice: existingLDevice, edit: undefined }
	}

	const lDevice = createLDeviceElement(doc, sourceFunction)

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
}: CreateLNodeParams): Insert {
	const lNodeElement = createLNodeElementInIED(lNode, doc)

	const edit: Insert = {
		node: lNodeElement,
		parent: lDevice,
		reference: null
	}

	return edit
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
	
	const lNodesToAdd = lNodes.filter((lNode) => {
		const exists = hasLNodeInTargetDoc(doc, lNode)
		if (exists) {
			console.warn(
				`[createLNodesInAccessPoint] LN ${lNode.lnClass}:${lNode.lnType}:${lNode.lnInst} already exists in target document, skipping`
			)
		}
		return !exists
	})
	
	if (lNodesToAdd.length === 0) {
		console.info('[createLNodesInAccessPoint] No new lNodes to add')
		return
	}
	
	const edits: Insert[] = []
	const { serverElement, edit: serverEdit } = ensureServer(accessPoint, doc)
	const { lDevice, edit: lDeviceEdit } = ensureLDevice(
		serverElement,
		doc,
		sourceFunction
	)
	if (serverEdit) edits.push(serverEdit)
	if (lDeviceEdit) edits.push(lDeviceEdit)

	for (const lNode of lNodesToAdd) {
		const lNodeEdit = createLNodeInAccessPoint({
			lNode,
			lDevice,
			doc
		})
		edits.push(lNodeEdit)
	}
	
	editor.commit(edits, {
		title: `Add LNodes to IED ${iedName}`
	})
}
