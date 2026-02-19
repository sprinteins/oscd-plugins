import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { bayStore } from '@/headless/stores'
import { buildEditsForClearingBayLNodeConnections } from './delete-elements.helper'
import { queryLNodesFromAccessPoint } from '../query-lnodes-from-access-point'

export function buildEditsForDeleteAccessPoint(
	accessPoint: Element,
	iedName: string
): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []
	const selectedBay = bayStore.scdBay

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
