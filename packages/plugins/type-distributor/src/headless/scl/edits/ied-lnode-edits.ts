import type { LNodeTemplate } from '@/headless/common-types'
import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { buildUpdatesForClearingBayLNodeConnections } from './bay-connections.helper'
import { queryLDeviceFromAccessPoint, queryLNodeInLDevice } from '../elements'

interface BuildEditsForDeleteLNodeFromAccessPointParams {
	iedName: string
	accessPoint: Element
	lNodeTemplate: LNodeTemplate
	selectedBay: Element | null
}

export function buildEditsForDeleteLNodeFromAccessPoint({
	iedName,
	accessPoint,
	lNodeTemplate,
	selectedBay
}: BuildEditsForDeleteLNodeFromAccessPointParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	if (!selectedBay) {
		throw new Error('No bay selected')
	}

	const ldInst = lNodeTemplate.ldInst
	if (!ldInst) {
		throw new Error(
			'LNodeTemplate must have ldInst to delete LNode from AccessPoint'
		)
	}

	const lDevice = queryLDeviceFromAccessPoint(accessPoint, ldInst)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${ldInst}" not found in AccessPoint "${accessPoint.getAttribute('name')}" of IED "${iedName}"`
		)
	}

	const lnElement = queryLNodeInLDevice(lDevice, lNodeTemplate)

	if (!lnElement) {
		throw new Error(
			`LNode with lnClass="${lNodeTemplate.lnClass}", lnType="${lNodeTemplate.lnType}", lnInst="${lNodeTemplate.lnInst}" not found in LDevice "${ldInst}"`
		)
	}

	const lNodeTemplates = [
		{
			lnClass: lNodeTemplate.lnClass,
			lnType: lNodeTemplate.lnType,
			lnInst: lNodeTemplate.lnInst,
			ldInst
		}
	]

	const bayEdits = buildUpdatesForClearingBayLNodeConnections({
		selectedBay,
		lNodeTemplates,
		iedName
	})
	edits.push(...bayEdits)

	const allLNs = Array.from(lDevice.querySelectorAll(':scope > LN'))
	const isLastLNode = allLNs.length === 1

	if (isLastLNode) {
		edits.push({
			node: lDevice
		} as Remove)
	} else {
		edits.push({
			node: lnElement
		} as Remove)
	}

	return edits
}

interface BuildEditsForDeleteLDeviceParams {
	iedName: string
	accessPoint: Element
	ldInst: string
	selectedBay: Element | null
}

export function buildEditsForDeleteLDevice({
	iedName,
	accessPoint,
	ldInst,
	selectedBay
}: BuildEditsForDeleteLDeviceParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	if (!selectedBay) {
		throw new Error('No bay selected')
	}

	const lDevice = queryLDeviceFromAccessPoint(accessPoint, ldInst)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${ldInst}" not found in AccessPoint "${accessPoint.getAttribute('name')}" of IED "${iedName}"`
		)
	}

	// Get all LN and LN0 elements from the LDevice
	const lnElements = Array.from(
		lDevice.querySelectorAll(':scope > LN, :scope > LN0')
	)

	// Build LNodeTemplates for all LNodes in this LDevice
	const lNodeTemplates: LNodeTemplate[] = lnElements.map((lnElement) => ({
		lnClass: lnElement.getAttribute('lnClass') ?? '',
		lnType: lnElement.getAttribute('lnType') ?? '',
		lnInst: lnElement.getAttribute('lnInst') ?? '',
		ldInst
	}))

	// Clear bay connections for all LNodes in this LDevice
	const bayEdits = buildUpdatesForClearingBayLNodeConnections({
		selectedBay,
		lNodeTemplates,
		iedName
	})
	edits.push(...bayEdits)

	// Remove the entire LDevice
	edits.push({
		node: lDevice
	} as Remove)

	return edits
}
