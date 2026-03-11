import { createElement } from '@oscd-plugins/core'
import type { Insert } from '@openscd/oscd-api'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate,
	LNodeType
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { getDocumentAndEditor } from '../../utils'
import {
	createLD0Element,
	createLDeviceElement,
	createLNodeElementInIED,
	createServerElementWithAuth,
	queryLDevice,
	queryServer,
	isLNodePresentInDevice
} from '../elements'
import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { buildEditsForClearingBayLNodeConnections } from './bay-connections.helper'
import { queryLNodesFromAccessPoint, queryIedElement } from '../queries'
import { buildEditsForLd0DataTypes } from './data-type-edits'

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
	doc: XMLDocument
}

export function createMultipleLNodesInAccessPoint({
	sourceFunction,
	lNodes,
	accessPoint,
	equipmentUuid,
	equipmentMatches,
	doc
}: CreateMultipleLNodesParams): Insert[] {
	const edits: Insert[] = []

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

export function buildAccessPointInserts(
	doc: XMLDocument,
	parent: Element,
	accessPoints: { name: string; description?: string }[],
	lnodeTypes: LNodeType[]
): Insert[] {
	return accessPoints.map((ap) => {
		const apElement = createElement(doc, 'AccessPoint', {
			name: ap.name,
			desc: ap.description ?? null
		})
		const serverElement = createElement(doc, 'Server', {})
		const authElement = createElement(doc, 'Authentication', {
			none: 'true'
		})
		serverElement.appendChild(authElement)
		serverElement.appendChild(createLD0Element(doc, lnodeTypes))
		apElement.appendChild(serverElement)
		return { node: apElement, parent, reference: null } as Insert
	})
}

interface BuildEditsForCreateAccessPointParams {
	iedName: string
	accessPoints: { name: string; description?: string }[]
	lnodeTypes: LNodeType[]
	doc: XMLDocument
	ssdDoc?: XMLDocument | null
}

export function buildEditsForCreateAccessPoint({
	iedName,
	accessPoints,
	lnodeTypes,
	doc,
	ssdDoc
}: BuildEditsForCreateAccessPointParams): Insert[] {
	const iedElement = queryIedElement(doc, iedName)
	if (!iedElement) {
		throw new Error(`IED with name "${iedName}" not found`)
	}

	const allEdits: Insert[] = buildAccessPointInserts(
		doc,
		iedElement,
		accessPoints,
		lnodeTypes
	)

	if (ssdDoc) {
		allEdits.push(...buildEditsForLd0DataTypes(doc, lnodeTypes, ssdDoc))
	}

	return allEdits
}

interface BuildEditsForDeleteAccessPointParams {
	accessPoint: Element
	iedName: string
	selectedBay: Element | null
}

export function buildEditsForDeleteAccessPoint({
	selectedBay,
	accessPoint,
	iedName
}: BuildEditsForDeleteAccessPointParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	if (selectedBay) {
		const apLNodes = queryLNodesFromAccessPoint(accessPoint)

		const bayEdits = buildEditsForClearingBayLNodeConnections(
			selectedBay,
			apLNodes,
			iedName
		)
		edits.push(...bayEdits)
	}

	edits.push({
		node: accessPoint
	} as Remove)

	return edits
}
