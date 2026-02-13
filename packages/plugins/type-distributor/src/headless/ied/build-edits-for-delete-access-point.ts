import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { hasRemainingConnectionsAfterClearing } from './check-bay-connections.helper'

export interface DeleteAccessPointParams {
	doc: Document
	iedName: string
	accessPointName: string
	selectedBay: Element
}

export interface DeleteLNodeFromAccessPointParams {
	doc: Document
	iedName: string
	accessPointName: string
	lDeviceInst: string
	lNode: {
		lnClass: string
		lnType: string
		lnInst: string
	}
	selectedBay: Element
}

/**
 * Parses LDevice inst to extract equipment name and function name
 * @param lDeviceInst - LDevice inst attribute (e.g., "-QC2_DisconnectorFunction")
 * @returns Object with equipmentName and functionName, or null if parsing fails
 */
function parseLDeviceInst(lDeviceInst: string): {
	equipmentName: string
	functionName: string
} | null {
	const lastUnderscoreIndex = lDeviceInst.lastIndexOf('_')
	if (lastUnderscoreIndex === -1) {
		// No underscore found - might be just a function name like "Protection"
		return { equipmentName: '', functionName: lDeviceInst }
	}
	
	const equipmentName = lDeviceInst.substring(0, lastUnderscoreIndex)
	const functionName = lDeviceInst.substring(lastUnderscoreIndex + 1)
	
	return { equipmentName, functionName }
}

/**
 * Finds matching Bay LNode within the specific equipment/function context
 * @param bay - Bay element to search in
 * @param iedName - IED name to match
 * @param lnClass - Logical node class
 * @param lnType - Logical node type
 * @param lnInst - Logical node instance
 * @param lDeviceInst - LDevice inst to identify the equipment/function context
 * @returns Array of matching LNode elements (should be 0 or 1)
 */
function findMatchingBayLNodes(
	bay: Element,
	iedName: string,
	lnClass: string,
	lnType: string,
	lnInst: string,
	lDeviceInst: string
): Element[] {
	const parsed = parseLDeviceInst(lDeviceInst)
	if (!parsed) return []
	
	const { equipmentName, functionName } = parsed
	
	// Find the specific equipment/function context
	let targetFunction: Element | null = null
	
	if (equipmentName) {
		// Equipment-level function: ConductingEquipment[@name="..."]/*Function[@name="..."]
		const equipment = bay.querySelector(
			`ConductingEquipment[name="${equipmentName}"]`
		)
		if (equipment) {
			targetFunction = Array.from(
				equipment.querySelectorAll(':scope > EqFunction, :scope > Function')
			).find((fn) => fn.getAttribute('name') === functionName) || null
		}
	} else {
		// Bay-level function: Bay/Function[@name="..."]
		targetFunction = Array.from(bay.querySelectorAll(':scope > Function')).find(
			(fn) => fn.getAttribute('name') === functionName
		) || null
	}
	
	if (!targetFunction) return []
	
	// Search for LNode only within this specific function context
	const matchingLNodes = Array.from(
		targetFunction.querySelectorAll(':scope > LNode')
	).filter((lnode) => {
		const matchesIed = lnode.getAttribute('iedName') === iedName
		const matchesClass = lnode.getAttribute('lnClass') === lnClass
		const matchesType = lnode.getAttribute('lnType') === lnType
		const matchesInst = lnode.getAttribute('lnInst') === lnInst
		
		return matchesIed && matchesClass && matchesType && matchesInst
	})
	
	return matchingLNodes
}

/**
 * Collects all LNodes from an AccessPoint's LDevices
 * @param accessPoint - AccessPoint element
 * @returns Array of LNode elements with their LDevice inst attribute
 */
function collectLNodesFromAccessPoint(accessPoint: Element): Array<{
	lnode: Element
	lDeviceInst: string
}> {
	const lnodes: Array<{ lnode: Element; lDeviceInst: string }> = []
	const server = accessPoint.querySelector(':scope > Server')
	
	if (!server) return lnodes
	
	const lDevices = Array.from(server.querySelectorAll(':scope > LDevice'))
	
	for (const lDevice of lDevices) {
		const inst = lDevice.getAttribute('inst') || ''
		const lns = Array.from(lDevice.querySelectorAll(':scope > LN'))
		
		for (const ln of lns) {
			lnodes.push({
				lnode: ln,
				lDeviceInst: inst
			})
		}
	}
	
	return lnodes
}

/**
 * Builds edits for deleting an AccessPoint and clearing Bay LNode references
 * @param params - Delete parameters
 * @returns Array of edit operations (Remove for AP, SetAttributes for Bay LNodes, optional SetAttributes for Bay templateUuid)
 */
export function buildEditsForDeleteAccessPoint(
	params: DeleteAccessPointParams
): (Remove | SetAttributes)[] {
	const { doc, iedName, accessPointName, selectedBay } = params
	const edits: (Remove | SetAttributes)[] = []
	
	// 1. Find and validate AccessPoint
	const ied = doc.querySelector(`IED[name="${iedName}"]`)
	if (!ied) {
		throw new Error(`IED with name "${iedName}" not found`)
	}
	
	const accessPoint = ied.querySelector(`:scope > AccessPoint[name="${accessPointName}"]`)
	if (!accessPoint) {
		throw new Error(
			`AccessPoint with name "${accessPointName}" not found in IED "${iedName}"`
		)
	}
	
	// 2. Collect all LNodes from this AccessPoint
	const apLNodes = collectLNodesFromAccessPoint(accessPoint)
	
	// 3. For each LNode in AP, find matching Bay LNodes and create SetAttributes edits to clear iedName
	const clearedBayLNodes = new Set<Element>()
	
	for (const { lnode, lDeviceInst } of apLNodes) {
		const lnClass = lnode.getAttribute('lnClass')
		const lnType = lnode.getAttribute('lnType')
		const lnInst = lnode.getAttribute('lnInst')
		
		if (!lnClass || !lnType) continue
		
		const matchingBayLNodes = findMatchingBayLNodes(
			selectedBay,
			iedName,
			lnClass,
			lnType,
			lnInst || '',
			lDeviceInst
		)
		
		for (const bayLNode of matchingBayLNodes) {
			clearedBayLNodes.add(bayLNode)
			
			edits.push({
				element: bayLNode,
				attributes: {
					iedName: null,
					ldInst: null
				},
				attributesNS: {}
			} as SetAttributes)
		}
	}
	
	// 4. Check if Bay will have remaining connections after clearing
	// Only clear templateUuid if we actually cleared some connections AND no connections remain
	const willHaveRemainingConnections = hasRemainingConnectionsAfterClearing(
		selectedBay,
		clearedBayLNodes
	)
	
	// 5. If we cleared connections and no remaining connections, clear Bay templateUuid
	const shouldClearTemplateUuid = clearedBayLNodes.size > 0 && !willHaveRemainingConnections
	
	if (shouldClearTemplateUuid) {
		edits.push({
			element: selectedBay,
			attributes: {
				templateUuid: null
			},
			attributesNS: {}
		} as SetAttributes)
	}
	
	// 6. Add Remove edit for the AccessPoint (at the end so it's the last operation)
	edits.push({
		node: accessPoint
	} as Remove)
	
	return edits
}

/**
 * Builds edits for deleting a single LNode from an AccessPoint and clearing its Bay reference
 * @param params - Delete parameters
 * @returns Array of edit operations
 */
export function buildEditsForDeleteLNodeFromAccessPoint(
	params: DeleteLNodeFromAccessPointParams
): (Remove | SetAttributes)[] {
	const { doc, iedName, accessPointName, lDeviceInst, lNode, selectedBay } = params
	const edits: (Remove | SetAttributes)[] = []
	
	// 1. Find and validate AccessPoint and LDevice
	const ied = doc.querySelector(`IED[name="${iedName}"]`)
	if (!ied) {
		throw new Error(`IED with name "${iedName}" not found`)
	}
	
	const accessPoint = ied.querySelector(`:scope > AccessPoint[name="${accessPointName}"]`)
	if (!accessPoint) {
		throw new Error(
			`AccessPoint with name "${accessPointName}" not found in IED "${iedName}"`
		)
	}
	
	const server = accessPoint.querySelector(':scope > Server')
	if (!server) {
		throw new Error(
			`Server not found in AccessPoint "${accessPointName}" of IED "${iedName}"`
		)
	}
	
	const lDevice = server.querySelector(`:scope > LDevice[inst="${lDeviceInst}"]`)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${lDeviceInst}" not found in AccessPoint "${accessPointName}"`
		)
	}
	
	// 2. Find the specific LNode to delete
	const lnElement = Array.from(lDevice.querySelectorAll(':scope > LN')).find(
		(ln) =>
			ln.getAttribute('lnClass') === lNode.lnClass &&
			ln.getAttribute('lnType') === lNode.lnType &&
			ln.getAttribute('lnInst') === lNode.lnInst
	)
	
	if (!lnElement) {
		throw new Error(
			`LNode with lnClass="${lNode.lnClass}", lnType="${lNode.lnType}", lnInst="${lNode.lnInst}" not found in LDevice "${lDeviceInst}"`
		)
	}
	
	// 3. Find matching Bay LNode and clear its iedName
	const matchingBayLNodes = findMatchingBayLNodes(
		selectedBay,
		iedName,
		lNode.lnClass,
		lNode.lnType,
		lNode.lnInst,
		lDeviceInst
	)
	
	const clearedBayLNodes = new Set<Element>()
	
	for (const bayLNode of matchingBayLNodes) {
		clearedBayLNodes.add(bayLNode)
		
		edits.push({
			element: bayLNode,
			attributes: {
				iedName: null,
				ldInst: null
			},
			attributesNS: {}
		} as SetAttributes)
	}
	
	// 4. Check if Bay will have remaining connections after clearing
	// Only clear templateUuid if we actually cleared some connections AND no connections remain
	const willHaveRemainingConnections = hasRemainingConnectionsAfterClearing(
		selectedBay,
		clearedBayLNodes
	)
	
	// 5. If we cleared connections and no remaining connections, clear Bay templateUuid
	const shouldClearTemplateUuid = clearedBayLNodes.size > 0 && !willHaveRemainingConnections
	
	if (shouldClearTemplateUuid) {
		edits.push({
			element: selectedBay,
			attributes: {
				templateUuid: null
			},
			attributesNS: {}
		} as SetAttributes)
	}
	
	// 6. Check if this is the last LNode in the LDevice
	// Count all LN elements (excluding LN0 which is structural)
	const allLNs = Array.from(lDevice.querySelectorAll(':scope > LN'))
	const isLastLNode = allLNs.length === 1
	
	if (isLastLNode) {
		// Remove the entire LDevice if this is the last LNode
		edits.push({
			node: lDevice
		} as Remove)
	} else {
		// Otherwise just remove the specific LNode
		edits.push({
			node: lnElement
		} as Remove)
	}
	
	return edits
}
