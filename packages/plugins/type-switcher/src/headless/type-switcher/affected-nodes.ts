import type { HashedElementGroup } from '@oscd-plugins/core'
import { getParent, type ParentElement } from './parent-element'

export type AffectedNode = {
	parent: ParentElement
	typeId: string
}

export function getAffectedNodes(
	group: HashedElementGroup,
	sourceIndexes: number[]
): AffectedNode[] {
	return sourceIndexes.flatMap((index) => {
		const source = group[index]
		if (!source) {
			throw new Error(`No type found at index ${index}`)
		}

		return source.usages.map((usage) => ({
			parent: getParent(usage),
			typeId: source.element.id
		}))
	})
}
