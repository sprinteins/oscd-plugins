import type { Insert, Remove, SetAttributes } from '@openscd/oscd-api'
import type { LNodeTemplate } from '@/headless/common-types'
import {
	createLNodeElementInIED,
} from '../elements'

type BuildEditsForLDeviceRenameParams = {
	ied: Element
	oldInst: string
	newInst: string
	newLNodeTemplates: LNodeTemplate[]
	doc: XMLDocument
}

export function buildEditsForLDeviceRename({
	ied,
	oldInst,
	newInst,
	newLNodeTemplates,
	doc
}: BuildEditsForLDeviceRenameParams): (SetAttributes | Remove | Insert)[] {
	const iedName = ied.getAttribute('name') ?? ''
	const edits: (SetAttributes | Remove | Insert)[] = []

	const lDevice = ied.querySelector(
		`AccessPoint > Server > LDevice[inst="${oldInst}"]`
	)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${oldInst}" not found in IED "${iedName}"`
		)
	}

	edits.push({
		element: lDevice,
		attributes: { inst: newInst, ldName: `${iedName}_${newInst}` },
		attributesNS: {}
	} as SetAttributes)

	const oldLnElements = Array.from(lDevice.querySelectorAll(':scope > LN'))
	for (const ln of oldLnElements) {
		edits.push({ node: ln } as Remove)
	}

	for (const template of newLNodeTemplates) {
		const lnElement = createLNodeElementInIED(template, doc)
		edits.push({
			node: lnElement,
			parent: lDevice,
			reference: null
		} as Insert)
	}

	return edits
}
