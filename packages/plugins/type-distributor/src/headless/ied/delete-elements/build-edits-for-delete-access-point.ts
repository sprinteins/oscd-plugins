import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { bayStore } from '@/headless/stores'
import { buildEditsForClearingBayLNodeConnections } from './delete-elements.helper'
import { queryLNodesFromAccessPoint } from '../query-lnodes-from-access-point'

interface BuildEditsForDeleteAccessPointParams {
	accessPoint: Element
	iedName: string
	selectedBay: Element | null
}

export function buildEditsForDeleteAccessPoint({
	selectedBay,
	accessPoint,
	iedName
}: BuildEditsForDeleteAccessPointParams): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	if (selectedBay) {
		const apLNodes = queryLNodesFromAccessPoint(accessPoint)

		const bayEdits = buildEditsForClearingBayLNodeConnections(
			selectedBay,
			apLNodes,
			iedName
		)
		edits.push(...bayEdits)
	}

	edits.push({
		node: accessPoint
	} as Remove)

	return edits
}
