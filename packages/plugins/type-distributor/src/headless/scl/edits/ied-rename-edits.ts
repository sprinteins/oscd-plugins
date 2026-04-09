import type { SetAttributes } from '@openscd/oscd-api'

type BuildUpdatesForRenameIedParams = {
	iedElement: Element
	oldName: string
	newName: string
	newDescription: string
	selectedBay: Element | null
}

export function buildUpdatesForRenameIed({
	iedElement,
	oldName,
	newName,
	newDescription,
	selectedBay
}: BuildUpdatesForRenameIedParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	edits.push({
		element: iedElement,
		attributes: {
			name: newName,
			desc: newDescription || null
		},
		attributesNS: {}
	} as SetAttributes)

	const lDevices = Array.from(iedElement.querySelectorAll('LDevice'))
	for (const lDevice of lDevices) {
		const inst = lDevice.getAttribute('inst') ?? ''
		edits.push({
			element: lDevice,
			attributes: { ldName: `${newName}_${inst}` },
			attributesNS: {}
		} as SetAttributes)
	}

	if (selectedBay) {
		const bayLNodes = Array.from(
			selectedBay.querySelectorAll(`LNode[iedName="${oldName}"]`)
		)
		for (const lNode of bayLNodes) {
			edits.push({
				element: lNode,
				attributes: { iedName: newName },
				attributesNS: {}
			} as SetAttributes)
		}
	}

	return edits
}
