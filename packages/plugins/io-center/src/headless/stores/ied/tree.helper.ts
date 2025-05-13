// CONSTANTS
import { TREE_LEVEL } from '@/headless/constants'
// STORES
import { iedStore } from '@/headless/stores'
// TYPES
import type { TreeItem, DataObject } from '@/headless/stores'

export function filterTree(
	nodes: TreeItem[],
	searchInputValue: string
): TreeItem[] {
	if (searchInputValue === '') return nodes

	return nodes
		.map((node) => {
			if (
				node.name.toLowerCase().includes(searchInputValue.toLowerCase())
			)
				return node

			if (!node.children) return

			if (node.children?.length === 0) return

			const filteredChildren = filterTree(node.children, searchInputValue)

			if (filteredChildren.length !== 0) {
				return { ...node, children: filteredChildren }
			}
		})
		.filter(Boolean) as TreeItem[]
}

export function getDataObjects(children: TreeItem[]): DataObject[] {
	return children
		.map((child) => {
			if (child.level === TREE_LEVEL.dO) return child

			if (child.children && child.children.length > 0)
				return getDataObjects(child.children)
		})
		.filter(Boolean)
		.flat() as DataObject[]
}

//====== TESTERS ======//

export function hasSelectedChild(children: TreeItem[]) {
	const dataObjects = getDataObjects(children)
	if (dataObjects.length === 0) return false

	return dataObjects.some((child) =>
		iedStore.selectedDataObjectIds.includes(child.id)
	)
}
