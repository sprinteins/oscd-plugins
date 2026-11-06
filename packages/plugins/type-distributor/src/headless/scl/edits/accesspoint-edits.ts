import type { Insert, Remove, SetAttributes } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate,
	LNodeType
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import {
	createLD0Element,
	createLDeviceElement,
	createLNodeElementInIED,
	createServerElementWithAuth,
	isLNodePresentInDevice,
	queryLDevice,
	queryServer,
	queryServerAtAccessPointsFromHost
} from '../elements'
import { queryIedElement, queryLDevicesFromAccessPoint } from '../queries'
import { buildUpdatesForClearingBayLNodeConnectionsInDocument } from './bay-connections.helper'
import { buildInsertsForLd0DataTypes } from './data-type-edits'

function ensureServer(
	accessPoint: Element,
	doc: XMLDocument
): { serverElement: Element; edit: Insert | undefined } {
	const serverAt = Array.from(accessPoint.children).find(
		(child) => child.localName === 'ServerAt'
	)
	if (serverAt) {
		const serverAtApName = serverAt.getAttribute('apName')
		const ied = accessPoint.parentElement
		const serverAccessPoint = serverAtApName
			? Array.from(ied?.children ?? []).find(
					(child) =>
						child.localName === 'AccessPoint' &&
						child.getAttribute('name') === serverAtApName
				)
			: undefined
		const sharedServer = serverAccessPoint
			? queryServer(serverAccessPoint)
			: null
		if (!sharedServer) {
			throw new Error(
				`ServerAt on AccessPoint "${accessPoint.getAttribute('name') ?? ''}" references AccessPoint "${serverAtApName ?? ''}" without a Server`
			)
		}
		return { serverElement: sharedServer, edit: undefined }
	}

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
	doc: XMLDocument
	server: Element
	iedName: string
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
	lnodeTypes?: LNodeType[]
	functionUuidOverride?: string
}

function ensureLDevice({
	doc,
	server,
	iedName,
	sourceFunction,
	equipmentMatches,
	equipmentUuid,
	lnodeTypes,
	functionUuidOverride
}: EnsureLDeviceParams): { lDevice: Element; edit: Insert | undefined } {
	const existingLDevice = queryLDevice(server, {
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		functionUuidOverride
	})
	if (existingLDevice) {
		return { lDevice: existingLDevice, edit: undefined }
	}

	const lDevice = createLDeviceElement(doc, {
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		lnodeTypes,
		iedName,
		functionUuidOverride
	})

	const edit: Insert = {
		node: lDevice,
		parent: server,
		reference: null
	}

	return { lDevice, edit }
}

type createLNodeInAccessPointParams = {
	lNode: LNodeTemplate
	lDevice: Element
	doc: XMLDocument
}

function createLNodeInAccessPoint({
	lNode,
	lDevice,
	doc
}: createLNodeInAccessPointParams): Insert {
	const lNodeElement = createLNodeElementInIED(lNode, doc)

	const edit: Insert = {
		node: lNodeElement,
		parent: lDevice,
		reference: null
	}

	return edit
}

type createMultipleLNodesInAccessPointParams = {
	doc: XMLDocument
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	lNodes: LNodeTemplate[]
	accessPoint: Element
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
	lnodeTypes?: LNodeType[]
	functionUuidOverride?: string
}

export function createMultipleLNodesInAccessPoint({
	sourceFunction,
	lNodes,
	accessPoint,
	equipmentUuid,
	equipmentMatches,
	doc,
	lnodeTypes,
	functionUuidOverride
}: createMultipleLNodesInAccessPointParams): Insert[] {
	const edits: Insert[] = []
	const iedName = accessPoint.parentElement?.getAttribute('name') ?? ''

	const { serverElement, edit: serverEdit } = ensureServer(accessPoint, doc)
	const { lDevice, edit: lDeviceEdit } = ensureLDevice({
		server: serverElement,
		doc,
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		lnodeTypes,
		iedName,
		functionUuidOverride
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

type BuildInsertsForAccessPointsParams = {
	doc: XMLDocument
	parent: Element
	accessPoints: {
		name: string
		description?: string
		serverAtApName?: string
	}[]
	lnodeTypes: LNodeType[]
}

export function buildInsertsForAccessPoints({
	doc,
	parent,
	accessPoints,
	lnodeTypes
}: BuildInsertsForAccessPointsParams): Insert[] {
	const iedName = parent.getAttribute('name') ?? ''
	return accessPoints.map((ap) => {
		const apElement = createElement(doc, 'AccessPoint', {
			name: ap.name,
			desc: ap.description ?? null
		})
		if (ap.serverAtApName) {
			apElement.appendChild(
				createElement(doc, 'ServerAt', {
					apName: ap.serverAtApName
				})
			)
			return { node: apElement, parent, reference: null } as Insert
		}

		const serverElement = createElement(doc, 'Server', {})
		const authElement = createElement(doc, 'Authentication', {
			none: 'true'
		})
		serverElement.appendChild(authElement)
		serverElement.appendChild(
			createLD0Element(doc, lnodeTypes, ap.name, iedName)
		)
		apElement.appendChild(serverElement)
		return { node: apElement, parent, reference: null } as Insert
	})
}

interface BuildInsertsForCreateAccessPointParams {
	iedName: string
	accessPoints: {
		name: string
		description?: string
		serverAtApName?: string
	}[]
	lnodeTypes: LNodeType[]
	doc: XMLDocument
	ssdDoc?: XMLDocument | null
}

export function buildInsertsForCreateAccessPoint({
	iedName,
	accessPoints,
	lnodeTypes,
	doc,
	ssdDoc
}: BuildInsertsForCreateAccessPointParams): Insert[] {
	const iedElement = queryIedElement(doc, iedName)
	if (!iedElement) {
		throw new Error(`IED with name "${iedName}" not found`)
	}

	const allEdits: Insert[] = buildInsertsForAccessPoints({
		doc,
		parent: iedElement,
		accessPoints,
		lnodeTypes
	})

	if (ssdDoc) {
		allEdits.push(
			...buildInsertsForLd0DataTypes({ doc, lnodeTypes, ssdDoc })
		)
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

	const apLNodes = queryLDevicesFromAccessPoint(accessPoint).flatMap(
		(ld) => ld.lNodes
	)

	const bayEdits = buildUpdatesForClearingBayLNodeConnectionsInDocument({
		document: accessPoint.ownerDocument,
		selectedBay,
		lNodeTemplates: apLNodes,
		iedName
	})
	edits.push(...bayEdits)

	edits.push(
		...queryServerAtAccessPointsFromHost(accessPoint).map(
			(serverAtAccessPoint) => ({ node: serverAtAccessPoint }) as Remove
		)
	)

	edits.push({
		node: accessPoint
	} as Remove)

	return edits
}
