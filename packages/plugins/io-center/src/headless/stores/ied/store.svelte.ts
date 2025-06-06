import { untrack } from 'svelte'
// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import { TREE_LEVEL } from '@/headless/constants'
// STORES
import { pluginLocalStore, logicalStore, canvasStore } from '@/headless/stores'
// HELPERS
import { iedElementToIedList } from './crud-operation.helper'
import { mapCurrentAccessPoint } from './tree-consolidation.helpers'
import { isDataObject } from './guards.helper'
import { createIedRequiredElements } from './required-element.helper'
import { filterTree, hasSelectedChild, getDataObjects } from './tree.helper'

// TYPES
import type {
	IED,
	TreeItem,
	DataObject,
	DataObjectParentTree
} from '@/headless/stores'

export class IedStore {
	//====== INITIALIZATION ======//

	//====== STATES

	selectedIEDUuid = $state<string>()

	selectedDataObjectIds = $state<string[]>([])
	parentTreeItemsToExpandOnUpdateByDataObjectId = $state<
		Record<string, DataObjectParentTree>
	>({})
	searchInputValue: string = $state('')

	//====== DERIVED

	// IED
	iEDList = $derived.by<IED[]>(() => {
		if (
			pluginLocalStore.isPluginInitialized &&
			`${pluginGlobalStore.editCount}`
		) {
			const untrackedIEDs = untrack(() =>
				Array.from(pluginLocalStore.rootSubElements?.ied || [])
			)
			return iedElementToIedList(untrackedIEDs)
		}
		return []
	})
	selectedIED = $derived.by<IED | undefined>(() => {
		if (this.selectedIEDUuid) {
			return iedStore.iEDList.find(
				(ied) => ied.uuid === this.selectedIEDUuid
			)
		}
	})

	selectedDataObjects = $derived.by<DataObject[]>(() => {
		if (this.selectedDataObjectIds.length)
			return getDataObjects(this.filteredTreeItems).filter((dataObject) =>
				this.selectedDataObjectIds.includes(dataObject.id)
			)
		return []
	})

	currentIedSubElements = $derived({
		accessPoint: this.selectedIED?.element?.querySelector('AccessPoint'),
		server: this.selectedIED?.element?.querySelector('Server'),
		lDevice: this.selectedIED?.element?.querySelector('LDevice[inst="LD0"]')
	})

	// tree
	treeItems = $derived.by<TreeItem[]>(() => {
		if (this.selectedIED) {
			return [
				{
					id: this.selectedIED.uuid,
					name: this.selectedIED.name,
					level: TREE_LEVEL.ied,
					children: untrack(() =>
						mapCurrentAccessPoint({
							accessPointElements: Array.from(
								this.selectedIED?.element?.querySelectorAll(
									'AccessPoint'
								) || []
							)
						})
					)
				}
			]
		}
		return []
	})
	filteredTreeItems = $derived.by<TreeItem[]>(() => {
		if (!this.treeItems?.[0]?.children?.length) return []
		return filterTree(this.treeItems[0].children, this.searchInputValue)
	})

	//====== ACTIONS ======//

	isSearched(treeItem: TreeItem) {
		return (
			this.searchInputValue !== '' &&
			treeItem.name
				.toLowerCase()
				.includes(this.searchInputValue.toLowerCase())
		)
	}

	handleSelectDataObject(params: {
		dataObject: DataObject
		parentTreeItemToExpandOnUpdate: DataObjectParentTree
		forceUpdate?: boolean
	}) {
		if (this.selectedDataObjectIds.includes(params.dataObject.id)) {
			this.selectedDataObjectIds = this.selectedDataObjectIds.filter(
				(id) => id !== params.dataObject.id
			)
			this.parentTreeItemsToExpandOnUpdateByDataObjectId =
				Object.fromEntries(
					Object.entries(
						this.parentTreeItemsToExpandOnUpdateByDataObjectId
					).filter(([id, _]) => id !== params.dataObject.id)
				)
		} else {
			this.selectedDataObjectIds = [
				...this.selectedDataObjectIds,
				params.dataObject.id
			]
			this.parentTreeItemsToExpandOnUpdateByDataObjectId = {
				...this.parentTreeItemsToExpandOnUpdateByDataObjectId,
				[params.dataObject.id]: params.parentTreeItemToExpandOnUpdate
			}
		}

		canvasStore.resetCurrentPorts()
	}

	resetSidebarStates() {
		this.parentTreeItemsToExpandOnUpdateByDataObjectId = {}
		this.selectedDataObjectIds = []
		this.searchInputValue = ''
	}

	resetStates() {
		this.resetSidebarStates()
		this.selectedIEDUuid = undefined
	}

	//====== PROXY ======//
	createIedRequiredElements = createIedRequiredElements
	// guards
	isDataObject = isDataObject
	// tree
	hasSelectedChild = hasSelectedChild
}

export const iedStore = new IedStore()
