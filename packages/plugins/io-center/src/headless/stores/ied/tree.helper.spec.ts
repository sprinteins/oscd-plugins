import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { TREE_LEVEL } from '@/headless/constants'
import type { TreeItem } from '@/headless/stores'
import { filterTree, getDataObjects, hasSelectedChild } from './tree.helper'

const mocks = vi.hoisted(() => ({
	iedStore: {
		selectedDataObjectIds: [] as string[]
	}
}))

vi.mock('@/headless/stores', () => ({
	iedStore: mocks.iedStore
}))

const tree: TreeItem[] = [
	{
		id: 'access-point',
		name: 'AP1',
		level: TREE_LEVEL.accessPoint,
		children: [
			{
				id: 'logical-device',
				name: 'LD1',
				level: TREE_LEVEL.lDevice,
				children: [
					{
						id: 'logical-node',
						name: 'XCBR1',
						level: TREE_LEVEL.lN,
						children: [
							{
								id: 'position',
								name: 'Pos',
								level: TREE_LEVEL.dO
							},
							{
								id: 'mode',
								name: 'Mod',
								level: TREE_LEVEL.dO
							}
						]
					}
				]
			}
		]
	}
]

beforeEach(() => {
	mocks.iedStore.selectedDataObjectIds = []
})

afterEach(() => {
	vi.restoreAllMocks()
})

function firstChild(item: TreeItem) {
	const child = item.children?.[0]
	if (!child) throw new Error(`Expected child for ${item.name}`)
	return child
}

it('GIVEN a nested tree WHEN a descendant name is searched case-insensitively THEN ancestors and only matching descendants remain', () => {
	const accessPoint = tree[0]
	const logicalDevice = firstChild(accessPoint)
	const logicalNode = firstChild(logicalDevice)
	const filtered = filterTree(tree, 'pos')

	expect(filtered).toEqual([
		{
			...accessPoint,
			children: [
				{
					...logicalDevice,
					children: [
						{
							...logicalNode,
							children: [
								{
									id: 'position',
									name: 'Pos',
									level: TREE_LEVEL.dO
								}
							]
						}
					]
				}
			]
		}
	])
})

it('GIVEN a nested tree WHEN a parent name is searched THEN the complete matching subtree remains', () => {
	const accessPoint = tree[0]
	const logicalDevice = firstChild(accessPoint)
	const logicalNode = firstChild(logicalDevice)

	expect(filterTree(tree, 'xcb')).toEqual([
		{
			...accessPoint,
			children: [
				{
					...logicalDevice,
					children: [logicalNode]
				}
			]
		}
	])
})

it('GIVEN selected data object descendants WHEN selection is checked THEN the selected branch is identified', () => {
	mocks.iedStore.selectedDataObjectIds = ['mode']

	expect(getDataObjects(tree).map((dataObject) => dataObject.id)).toEqual([
		'position',
		'mode'
	])
	expect(hasSelectedChild(tree)).toBe(true)
})
