import type { SetAttributes } from '@openscd/oscd-api'
import { queryServerAtAccessPointsFromHost } from '../elements'

type BuildUpdatesForRenameAccessPointParams = {
	accessPoint: Element
	iedName: string
	oldName: string
	newName: string
	newDescription: string
}

export function buildUpdatesForRenameAccessPoint({
	accessPoint,
	iedName,
	oldName,
	newName,
	newDescription
}: BuildUpdatesForRenameAccessPointParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	edits.push({
		element: accessPoint,
		attributes: {
			name: newName,
			desc: newDescription || null
		},
		attributesNS: {}
	} as SetAttributes)

	const oldLD0Inst = `LD0_${oldName}`
	const ld0 = accessPoint.querySelector(
		`Server > LDevice[inst="${oldLD0Inst}"]`
	)
	if (ld0) {
		const newInst = `LD0_${newName}`
		edits.push({
			element: ld0,
			attributes: {
				inst: newInst,
				ldName: `${iedName}_${newInst}`
			},
			attributesNS: {}
		} as SetAttributes)
	}

	if (oldName !== newName) {
		for (const serverAtAccessPoint of queryServerAtAccessPointsFromHost(
			accessPoint
		)) {
			const serverAtElement = Array.from(
				serverAtAccessPoint.children
			).find((child) => child.localName === 'ServerAt')
			if (!serverAtElement) continue

			edits.push({
				element: serverAtElement,
				attributes: { apName: newName },
				attributesNS: {}
			} as SetAttributes)
		}
	}

	return edits
}
