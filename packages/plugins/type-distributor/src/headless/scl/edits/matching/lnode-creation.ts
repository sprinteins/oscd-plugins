import type { LNodeTemplate } from '@/headless/common-types'
import { v4 as uuidv4 } from 'uuid'
import { createElement } from '@oscd-plugins/core'

export function createLNodeElement(
	doc: Document,
	lnodeTemplate: LNodeTemplate
): Element {
	const lnodeElement = createElement(doc, 'LNode', {
		uuid: uuidv4(),
		lnClass: lnodeTemplate.lnClass,
		lnInst: lnodeTemplate.lnInst,
		lnType: lnodeTemplate.lnType
	})

	return lnodeElement
}
