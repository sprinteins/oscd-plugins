import type { Remove, SetAttributes } from '@openscd/oscd-api'
import type { IedLNData } from '@/headless/common-types'
import { queryLDeviceFromAccessPoint, queryLNInLDevice } from '../elements'
import { buildUpdatesForClearingLNodeConnections } from './lnode-connections.edits'

interface BuildEditsForDeleteLNFromAccessPointParams {
	iedName: string
	accessPoint: Element
	ln: IedLNData
}

export function buildEditsForDeleteLNFromAccessPoint({
	iedName,
	accessPoint,
	ln
}: BuildEditsForDeleteLNFromAccessPointParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

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

	const allLNs = Array.from(lDevice.querySelectorAll(':scope > LN'))
	const isLastLN = allLNs.length === 1

	const connectionEdits = buildUpdatesForClearingLNodeConnections({
		document: accessPoint.ownerDocument,
		lnElements: isLastLN
			? Array.from(lDevice.querySelectorAll(':scope > LN, :scope > LN0'))
			: [lnElement],
		iedName
	})
	edits.push(...connectionEdits)

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
}

export function buildEditsForDeleteLDevice({
	iedName,
	accessPoint,
	ldInst
}: BuildEditsForDeleteLDeviceParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	const lDevice = queryLDeviceFromAccessPoint(accessPoint, ldInst)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${ldInst}" not found in AccessPoint "${accessPoint.getAttribute('name')}" of IED "${iedName}"`
		)
	}

	const lnElements = Array.from(
		lDevice.querySelectorAll(':scope > LN, :scope > LN0')
	)

	const connectionEdits = buildUpdatesForClearingLNodeConnections({
		document: accessPoint.ownerDocument,
		lnElements,
		iedName
	})
	edits.push(...connectionEdits)

	edits.push({
		node: lDevice
	} as Remove)

	return edits
}
