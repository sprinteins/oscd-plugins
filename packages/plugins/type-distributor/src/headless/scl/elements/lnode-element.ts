import { createElement } from '@oscd-plugins/core'
import { v4 as uuidv4 } from 'uuid'
import type { LNodeTemplate } from '../../common-types'

export function createLNodeElementInBay(
	doc: Document,
	lnodeTemplate: LNodeTemplate
): Element {
	return createElement(doc, 'LNode', {
		uuid: uuidv4(),
		lnClass: lnodeTemplate.lnClass,
		lnInst: lnodeTemplate.lnInst,
		lnType: lnodeTemplate.lnType
	})
}

export function createLNodeElementInIED(
	lNode: LNodeTemplate,
	doc: XMLDocument
): Element {
	const tag = lNode.lnClass === 'LLN0' ? 'LN0' : 'LN'
	const lnElement = createElement(doc, tag, {
		lnClass: lNode.lnClass,
		lnType: lNode.lnType,
		lnInst: lNode.lnInst
	})

	return lnElement
}

export function isLNodePresentInDevice(
	lNode: LNodeTemplate,
	lDevice: Element
): boolean {
	const attrs =
		`[lnClass="${lNode.lnClass}"]` +
		`[lnType="${lNode.lnType}"]` +
		`[lnInst="${lNode.lnInst}"]`

	const selector = `LN${attrs}, LN0${attrs}`
	return !!lDevice.querySelector(selector)
}

export function queryLNodeInLDevice(
	lDevice: Element,
	template: LNodeTemplate
): Element | null {
	const attrs = `[lnClass="${template.lnClass}"][lnType="${template.lnType}"][lnInst="${template.lnInst}"]`
	return lDevice.querySelector(`:scope > LN${attrs}`)
}
