import type { LNodeTemplate } from '@/headless/types'
import { v4 as uuidv4 } from 'uuid'

export function createLNodeElement(
	doc: Document,
	lnodeTemplate: LNodeTemplate
): Element {
	const lnodeElement = doc.createElement('LNode')
	lnodeElement.setAttribute('uuid', uuidv4())
	lnodeElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lnodeElement.setAttribute('lnInst', lnodeTemplate.lnInst)
	lnodeElement.setAttribute('lnType', lnodeTemplate.lnType)

	if (lnodeTemplate.iedName) {
		lnodeElement.setAttribute('iedName', lnodeTemplate.iedName)
	}

	return lnodeElement
}
