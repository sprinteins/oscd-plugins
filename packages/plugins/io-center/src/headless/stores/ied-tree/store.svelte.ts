import { NODE_TYPE } from '@/headless/constants'
// STORES
import { store } from '@/store.svelte'
// HELPERS
import { iedElementToIedList } from './ied.helper'
import { mapCurrentAccessPoint } from './tree-helpers'
import { isDataObject } from './guards.helper'
// TYPES
import type { IED, TreeItem, DataObject } from './types'

export class IedTreeStore {
	//====== INITIALIZATION ======//

	//====== STATES

	selectedIED = $state<IED>()

	selectedDataObject = $state<DataObject>()
	searchInputValue: string = $state('')

	//====== DERIVED

	iEDList: IED[] = $derived(iedElementToIedList())

	treeItems = $derived.by<TreeItem[]>(() =>
		this.selectedIED
			? [
					{
						id: this.selectedIED?.id,
						name: this.selectedIED?.name || 'unknown',
						level: NODE_TYPE.ied,
						children: mapCurrentAccessPoint({
							accessPointElements: Array.from(
								this.selectedIED?.element?.querySelectorAll(
									'AccessPoint'
								) || []
							)
						})
					}
				]
			: []
	)

	filteredTreeItems = $derived.by<TreeItem[]>(() => {
		if (!this.treeItems?.[0]?.children?.length) return []
		return this.filterTree(
			this.treeItems[0].children,
			this.searchInputValue
		)
	})

	//====== ACTIONS ======//

	filterTree(nodes: TreeItem[], searchTerm: string): TreeItem[] {
		if (searchTerm === '') return nodes

		return nodes
			.map((node) => {
				if (node.name.toLowerCase().includes(searchTerm.toLowerCase()))
					return node

				if (!node.children) return

				if (node.children?.length === 0) return

				const filteredChildren = this.filterTree(
					node.children,
					searchTerm
				)

				if (filteredChildren.length !== 0) {
					return { ...node, children: filteredChildren }
				}
			})
			.filter(Boolean) as TreeItem[]
	}

	isSearched(treeItem: TreeItem) {
		return (
			this.searchInputValue !== '' &&
			treeItem.name
				.toLowerCase()
				.includes(this.searchInputValue.toLowerCase())
		)
	}

	getDataObjects(children: TreeItem[]): TreeItem[] {
		return children
			.map((child) => {
				if (child.level === NODE_TYPE.dO) return child

				if (child.children && child.children.length > 0)
					return this.getDataObjects(child.children)
			})
			.filter(Boolean)
			.flat() as TreeItem[]
	}

	hasSelectedChild(children: TreeItem[]) {
		const dataObjects = this.getDataObjects(children)
		if (dataObjects.length === 0) return false

		return dataObjects.some(
			(child) => this.selectedDataObject?.id === child.id
		)
	}

	handleSelectDataObject(treeItem: TreeItem) {
		if (!isDataObject(treeItem)) return

		if (this.selectedDataObject?.id === treeItem.id)
			this.selectedDataObject = undefined
		else this.selectedDataObject = treeItem

		store._selectedLogicalConditioners = []
		store._selectedLogicalPhysicals = []
	}
}

export const iedTreeStore = new IedTreeStore()
