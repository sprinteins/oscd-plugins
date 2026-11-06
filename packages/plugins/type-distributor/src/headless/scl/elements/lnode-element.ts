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
