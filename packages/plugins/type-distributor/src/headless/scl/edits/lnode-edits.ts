import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type {
	ConductingEquipmentTemplate,
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import { bayStore } from '@/headless/stores'
import {
	createLDeviceElement,
	createLNodeElementInIED,
	createServerElementWithAuth,
	queryLDevice,
	queryServer,
	isLNodePresentInDevice
} from '../elements'

// ============================================================================
// buildEditsForBayLNode - SetAttributes edits for assigning iedName to LNodes
// ============================================================================

type UpdateBayLNodesParams = {
	lNodes: LNodeTemplate[]
	iedName: string
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
}

function findMatchingLNodeElement(
	lNode: LNodeTemplate,
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element | null {
	const functionElements = queryFunctionElements(
		sourceFunction,
		equipmentUuid
	)

	for (const functionElement of functionElements) {
		const matches = queryLNodeMatchesFromFunction(functionElement, lNode)
		const preferred = choosePreferredMatch(matches)
		if (preferred) return preferred
	}

	return null
}

function queryFunctionElements(
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element[] {
	if (equipmentUuid) {
		const match = bayStore.equipmentMatches.find(
			(m) => m.bayTypeEquipment.uuid === equipmentUuid
		)
		if (!match) return []

		const targetEquipment = match.scdElement
		return Array.from(
			targetEquipment.querySelectorAll(
				`EqFunction[name="${sourceFunction.name}"]`
			)
		)
	}

	const scdBay = bayStore.scdBay
	if (!scdBay) {
		console.warn('No bay selected or bay not found in document')
		return []
	}

	return Array.from(
		scdBay.querySelectorAll(
			`:scope > Function[name="${sourceFunction.name}"]`
		)
	)
}

function queryLNodeMatchesFromFunction(
	functionElement: Element,
	lNode: LNodeTemplate
): Element[] {
	const { lnType, lnInst } = lNode

	const selector = `LNode[lnType="${lnType}"][lnInst="${lnInst}"]`
	return Array.from(functionElement.querySelectorAll(selector))
}

function choosePreferredMatch(matches: Element[]): Element | null {
	if (matches.length === 0) return null
	const unassigned = matches.find((el) => !el.getAttribute('iedName'))
	return unassigned ?? matches[0]
}

function createSetIedNameEdit(
	element: Element,
	iedName: string
): SetAttributes {
	return {
		element,
		attributes: { iedName },
		attributesNS: {}
	}
}

export function buildEditsForBayLNode({
	lNodes,
	iedName,
	sourceFunction,
	equipmentUuid
}: UpdateBayLNodesParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement(
			lNode,
			sourceFunction,
			equipmentUuid
		)
		if (!lnodeElement) {
			continue
		}
		
		const currentIedName = lnodeElement.getAttribute('iedName')
		if (currentIedName) {
			continue
		}
		edits.push(createSetIedNameEdit(lnodeElement, iedName))
	}

	return edits
}

// ============================================================================
// createMultipleLNodesInAccessPoint - Insert edits for LNodes in AccessPoint
// ============================================================================

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
