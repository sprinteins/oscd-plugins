import { createElement } from '@oscd-plugins/core'
import type { IedLNData, LNodeTemplate } from '../../common-types'

function getLNTagName(ln: LNodeTemplate): string {
	return ln.lnClass === 'LLN0' ? 'LN0' : 'LN'
}

export function createLNElementInIED(
	ln: LNodeTemplate,
	doc: XMLDocument
): Element {
	return createElement(doc, getLNTagName(ln), {
		lnClass: ln.lnClass,
		lnType: ln.lnType,
		inst: ln.lnInst
	})
}

export function isLNPresentInDevice(
	ln: LNodeTemplate,
	lDevice: Element
): boolean {
	const attrs =
		`[lnClass="${ln.lnClass}"]` +
		`[lnType="${ln.lnType}"]` +
		`[inst="${ln.lnInst}"]`

	return !!lDevice.querySelector(`LN${attrs}, LN0${attrs}`)
}

export function queryLNInLDevice(
	lDevice: Element,
	ln: IedLNData
): Element | null {
	return (
		Array.from(lDevice.children).find(
			(element) =>
				element.localName === 'LN' &&
				element.getAttribute('lnClass') === ln.lnClass &&
				element.getAttribute('lnType') === ln.lnType &&
				element.getAttribute('inst') === ln.inst &&
				(element.getAttribute('prefix') ?? '') === (ln.prefix ?? '')
		) ?? null
	)
}
