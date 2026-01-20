import type { Insert } from '@openscd/oscd-api'
import type { LNodeTemplate } from '../../types'
import { getNextLNodeInstance } from '../utils/element-helpers'

/**
 * Creates an LN element with proper attributes
 * @param doc The XML document
 * @param lnodeTemplate The LNode template from SSD
 * @param lDevice The parent LDevice element
 * @returns The created LN element
 */
export function createLNElement(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	lDevice: Element
): Element {
	const lnElement = doc.createElement('LN')
	lnElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lnElement.setAttribute('lnType', lnodeTemplate.lnType)

	// Get the next available instance number
	const lnInst = getNextLNodeInstance(lDevice, lnodeTemplate.lnClass)
	lnElement.setAttribute('lnInst', lnInst)

	return lnElement
}

/**
 * Creates an Insert edit for adding an LN element to an LDevice
 * @param doc The XML document
 * @param lnodeTemplate The LNode template from SSD
 * @param lDevice The parent LDevice element
 * @returns The Insert edit
 */
export function createLNInsertEdit(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	lDevice: Element
): Insert {
	const lnElement = createLNElement(doc, lnodeTemplate, lDevice)

	return {
		parent: lDevice,
		node: lnElement,
		reference: null
	}
}
