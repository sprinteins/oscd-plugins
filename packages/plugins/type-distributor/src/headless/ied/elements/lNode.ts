import type { LNodeTemplate } from '../../common-types'

export function createLNodeElementInIED(
	lNode: LNodeTemplate,
	doc: XMLDocument
): Element {
	const lnElement = doc.createElement(
		lNode.lnClass === 'LLN0' ? 'LLN0' : 'LN'
	)
	lnElement.setAttribute('lnClass', lNode.lnClass)
	lnElement.setAttribute('lnType', lNode.lnType)
	lnElement.setAttribute('lnInst', lNode.lnInst)

	return lnElement
}

function hasLNodeInLDevice(lDevice: Element, lNode: LNodeTemplate): boolean {
	return Array.from(lDevice.children).some(
		(child) =>
			(child.localName === 'LN' || child.localName === 'LN0') &&
			child.getAttribute('lnClass') === lNode.lnClass &&
			child.getAttribute('lnType') === lNode.lnType &&
			child.getAttribute('lnInst') === lNode.lnInst
	)
}

export function hasLNodeInTargetDoc(
	targetDoc: XMLDocument,
	lNode: LNodeTemplate
): boolean {
	const lDevices = targetDoc.querySelectorAll(
		'IED > AccessPoint > Server > LDevice'
	)

	return Array.from(lDevices).some((lDevice) =>
		hasLNodeInLDevice(lDevice, lNode)
	)
}
