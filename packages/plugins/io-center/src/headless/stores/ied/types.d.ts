import type { TREE_LEVEL } from '@/headless/constants'
import type { PortConfig } from '@/headless//stores'

export type IED = {
	element: Element | null
	uuid: string
	name: string
}

export type TreeItem = {
	id: string
	name: string
	level: (typeof TREE_LEVEL)[keyof typeof TREE_LEVEL]
	children?: TreeItem[]
}

export type DataObjectParentTree = {
	lN: string
	lDevice: string
	accessPoint: string
}
