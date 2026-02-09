import type { LNodeTemplate } from '../../common-types'
import { createElement } from '@oscd-plugins/core'

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

export function hasLNodeInTargetDoc(
	targetDoc: XMLDocument,
	lNode: LNodeTemplate,
	lDevice?: Element
): boolean {
	if (lDevice) {
		const attrs =
			`[lnClass="${lNode.lnClass}"]` +
			`[lnType="${lNode.lnType}"]` +
			`[lnInst="${lNode.lnInst}"]`

		const selector = `LN${attrs}, LN0${attrs}`
		return !!lDevice.querySelector(selector)
	}

	const base = 'IED > AccessPoint > Server > LDevice >'
	const attrs =
		`[lnClass="${lNode.lnClass}"]` +
		`[lnType="${lNode.lnType}"]` +
		`[lnInst="${lNode.lnInst}"]`

	const selector = `${base} LN${attrs}, ${base} LN0${attrs}`

	return !!targetDoc.querySelector(selector)
}
