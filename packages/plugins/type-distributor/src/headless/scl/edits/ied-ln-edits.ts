import type { Remove, SetAttributes } from '@openscd/oscd-api'
import type { IedLNData, LNodeTemplate } from '@/headless/common-types'
import { queryLDeviceFromAccessPoint, queryLNInLDevice } from '../elements'
import { buildUpdatesForClearingBayLNodeConnections } from './bay-connections.helper'

interface BuildEditsForDeleteLNFromAccessPointParams {
	iedName: string
	accessPoint: Element
	ln: IedLNData
	selectedBay: Element | null
}

export function buildEditsForDeleteLNFromAccessPoint({
	iedName,
	accessPoint,
	ln,
	selectedBay
}: BuildEditsForDeleteLNFromAccessPointParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	if (!selectedBay) {
		throw new Error('No bay selected')
	}

	const ldInst = ln.ldInst
	if (!ldInst) {
		throw new Error(
			'IED LN data must have ldInst to delete LN from AccessPoint'
		)
	}

	const lDevice = queryLDeviceFromAccessPoint(accessPoint, ldInst)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${ldInst}" not found in AccessPoint "${accessPoint.getAttribute('name')}" of IED "${iedName}"`
		)
	}

	const lnElement = queryLNInLDevice(lDevice, ln)

	if (!lnElement) {
		throw new Error(
			`LN with lnClass="${ln.lnClass}", lnType="${ln.lnType}", inst="${ln.inst}" not found in LDevice "${ldInst}"`
		)
	}

	const lNodeTemplates: LNodeTemplate[] = [
		{
			lnClass: ln.lnClass,
			lnType: ln.lnType,
			lnInst: ln.inst,
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
	const isLastLN = allLNs.length === 1

	if (isLastLN) {
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

	const lnElements = Array.from(
		lDevice.querySelectorAll(':scope > LN, :scope > LN0')
	)

	const lNodeTemplates: LNodeTemplate[] = lnElements.map((lnElement) => ({
		lnClass: lnElement.getAttribute('lnClass') ?? '',
		lnType: lnElement.getAttribute('lnType') ?? '',
		lnInst: lnElement.getAttribute('inst') ?? '',
		ldInst
	}))

	const bayEdits = buildUpdatesForClearingBayLNodeConnections({
		selectedBay,
		lNodeTemplates,
		iedName
	})
	edits.push(...bayEdits)

	edits.push({
		node: lDevice
	} as Remove)

	return edits
}
