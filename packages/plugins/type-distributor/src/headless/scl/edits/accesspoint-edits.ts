import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { createElement } from '@oscd-plugins/core'
import type { Insert } from '@openscd/oscd-api'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/matching'
import { getDocumentAndEditor } from '../../utils'
import {
	createLDeviceElement,
	createLNodeElementInIED,
	createServerElementWithAuth,
	queryLDevice,
	queryServer,
	isLNodePresentInDevice
} from '../elements'

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

type EnsureLDeviceParams = {
	server: Element
	doc: XMLDocument
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	equipmentUuid?: string
	equipmentMatches: EquipmentMatch[]
}

function ensureLDevice({
	server,
	doc,
	sourceFunction,
	equipmentUuid,
	equipmentMatches
}: EnsureLDeviceParams): { lDevice: Element; edit: Insert | undefined } {
	const existingLDevice = queryLDevice(server, {
		sourceFunction,
		equipmentUuid,
		equipmentMatches
	})
	if (existingLDevice) {
		return { lDevice: existingLDevice, edit: undefined }
	}

	const lDevice = createLDeviceElement(doc, {
		sourceFunction,
		equipmentUuid,
		equipmentMatches
	})

	const edit: Insert = {
		node: lDevice,
		parent: server,
		reference: null
	}

	return { lDevice, edit }
}

type CreateLNodeParams = {
	lNode: LNodeTemplate
	lDevice: Element
	doc: XMLDocument
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

type CreateMultipleLNodesParams = {
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	lNodes: LNodeTemplate[]
	accessPoint: Element
	equipmentUuid?: string
	equipmentMatches: EquipmentMatch[]
}

export function createMultipleLNodesInAccessPoint({
	sourceFunction,
	lNodes,
	accessPoint,
	equipmentUuid,
	equipmentMatches
}: CreateMultipleLNodesParams): Insert[] {
	const edits: Insert[] = []

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}

	const doc = pluginGlobalStore.xmlDocument

	const { serverElement, edit: serverEdit } = ensureServer(accessPoint, doc)
	const { lDevice, edit: lDeviceEdit } = ensureLDevice({
		server: serverElement,
		doc,
		sourceFunction,
		equipmentUuid,
		equipmentMatches
	})

	const lNodesToAdd = lNodes.filter((lNode) => {
		const exists = isLNodePresentInDevice(lNode, lDevice)
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

type CreateAccessPointsParams = {
	iedName: string
	accessPoints: { name: string; description?: string }[]
	squash?: boolean
}

export function createAccessPoints({
	iedName,
	accessPoints,
	squash = false
}: CreateAccessPointsParams): void {
	const { doc, editor } = getDocumentAndEditor()

	const iedElement = doc.querySelector(`IED[name="${iedName}"]`)
	if (!iedElement) {
		throw new Error(`IED with name "${iedName}" not found`)
	}

	for (const ap of accessPoints) {
		const apElement = createElement(doc, 'AccessPoint', {
			name: ap.name,
			desc: ap.description ?? null
		})

		const serverElement = createElement(doc, 'Server', {})

		const authElement = createElement(doc, 'Authentication', {
			none: 'true'
		})

		serverElement.appendChild(authElement)
		apElement.appendChild(serverElement)

		const edit: Insert = {
			node: apElement,
			parent: iedElement,
			reference: null
		}

		editor.commit(edit, {
			squash
		})
	}
}
