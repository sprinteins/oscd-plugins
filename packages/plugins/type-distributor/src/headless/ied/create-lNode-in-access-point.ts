import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert } from '@openscd/oscd-api'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '../common-types'
import {
	createLDeviceElement,
	createLNodeElementInIED,
	createServerElementWithAuth,
	queryLDevice,
	queryServer,
	hasLNodeInTargetDoc
} from './elements'

type CreateMultipleLNodesParams = {
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	lNodes: LNodeTemplate[]
	accessPoint: Element
	equipmentUuid?: string
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
	const existingServer = queryServer(accessPoint)
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
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): { lDevice: Element; edit: Insert | undefined } {
	const existingLDevice = queryLDevice(server, sourceFunction, equipmentUuid)
	if (existingLDevice) {
		return { lDevice: existingLDevice, edit: undefined }
	}

	const lDevice = createLDeviceElement(doc, sourceFunction, equipmentUuid)

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

export function createMultipleLNodesInAccessPoint({
	sourceFunction,
	lNodes,
	accessPoint,
	equipmentUuid
}: CreateMultipleLNodesParams): Insert[] {
	const edits: Insert[] = []

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}

	const doc = pluginGlobalStore.xmlDocument

	const { serverElement, edit: serverEdit } = ensureServer(accessPoint, doc)
	const { lDevice, edit: lDeviceEdit } = ensureLDevice(
		serverElement,
		doc,
		sourceFunction,
		equipmentUuid
	)

	const lNodesToAdd = lNodes.filter((lNode) => {
		const exists = hasLNodeInTargetDoc(doc, lNode, lDevice)
		if (exists) {
			console.warn(
				`[createLNodesInAccessPoint] LN ${lNode.lnClass}:${lNode.lnType}:${lNode.lnInst} already exists in LDevice, skipping`
			)
		}
		return !exists
	})

	if (lNodesToAdd.length === 0) {
		console.info('[createLNodesInAccessPoint] No new lNodes to add')
		return edits
	}
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

	return edits
}
