import type { LNodeTemplate } from '../../common-types'
import { v4 as uuidv4 } from 'uuid'
import { createElement } from '@oscd-plugins/core'

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

function getLNTagName(lnode: LNodeTemplate): string {
	return lnode.lnClass === 'LLN0' ? 'LN0' : 'LN'
}

export function createLNodeElementInIED(
	lNode: LNodeTemplate,
	doc: XMLDocument
): Element {
	const lnElement = createElement(doc, getLNTagName(lNode), {
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
