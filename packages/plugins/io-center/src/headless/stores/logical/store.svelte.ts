// CORE
import { dialogStore } from '@oscd-plugins/core-ui-svelte'
// HELPERS
import { filterLogical } from './filter.helper'
import { createRequiredLNodeType } from './required-element.helper'
import {
	createLogicals,
	getLogical,
	updateLogical,
	removeLogical
} from './common-crud-operation.helper'
// CONSTANTS
import {
	LOGICAL_CONDITIONER_CLASS,
	LOGICAL_PHYSICAL_CLASS
} from '@/headless/constants'
// STORES
import { pluginLocalStore, iedStore, canvasStore } from '@/headless/stores'
// COMPONENTS
import LogicalDialog from '@/ui/sidebar-right/logical-dialog.svelte'
// TYPES
import type {
	LogicalKind,
	LogicalConditionerClass,
	LogicalPhysicalClass,
	LogicalFilterValues,
	RawLogical
} from '@/headless/stores'

export class LogicalStore {
	//====== INITIALIZATION ======//

	//====== STATES

	conditionerFilterValues = $state<
		LogicalFilterValues<LogicalConditionerClass[]>
	>(this.initFilterValues('conditioner'))
	physicalFilterValues = $state<LogicalFilterValues<LogicalPhysicalClass[]>>(
		this.initFilterValues('physical')
	)

	//====== DERIVED

	conditioners = $derived.by(() => {
		if (iedStore.selectedDataObjectId && canvasStore.connectionUuids.length)
			return this.consolidateLogical({
				logicalKind: 'conditioner',
				logicalFilterValues: this.conditionerFilterValues
			})

		return { raw: [], filtered: [], selected: [] }
	})

	physicals = $derived.by(() => {
		if (iedStore.selectedDataObjectId && canvasStore.connectionUuids.length)
			return this.consolidateLogical({
				logicalKind: 'physical',
				logicalFilterValues: this.physicalFilterValues
			})

		return { raw: [], filtered: [], selected: [] }
	})

	//====== ACTIONS ======//

	initFilterValues<
		GenericLogical extends LogicalKind,
		GenericLogicalClass extends GenericLogical extends 'conditioner'
			? LogicalConditionerClass[]
			: LogicalPhysicalClass[]
	>(logical: GenericLogical) {
		let logicalClass: GenericLogicalClass =
			[] as unknown as GenericLogicalClass
		if (logical === 'conditioner')
			logicalClass = Object.values(
				LOGICAL_CONDITIONER_CLASS
			) as GenericLogicalClass
		else if (logical === 'physical')
			logicalClass = Object.values(
				LOGICAL_PHYSICAL_CLASS
			) as GenericLogicalClass

		return {
			searchInput: '',
			scope: 'all',
			selectedLogicalClass: [] as unknown as GenericLogicalClass,
			availableLogicalClass: logicalClass,
			selectedLogicalIds: []
		} as LogicalFilterValues<GenericLogicalClass>
	}

	consolidateLogical<
		GenericLogical extends LogicalKind,
		GenericLogicalClass extends GenericLogical extends 'conditioner'
			? LogicalConditionerClass[]
			: LogicalPhysicalClass[]
	>(params: {
		logicalKind: GenericLogical
		logicalFilterValues: LogicalFilterValues<GenericLogicalClass>
	}) {
		const raw = getLogical({
			logicalKind: params.logicalKind,
			logicalClass: params.logicalFilterValues.availableLogicalClass
		})
		const filtered = filterLogical({
			rawLogicals: raw,
			searchedTerm: params.logicalFilterValues.searchInput,
			filterScope: params.logicalFilterValues.scope,
			selectedLogicalClass:
				params.logicalFilterValues.selectedLogicalClass
		})

		return {
			raw,
			filtered,
			selected: raw.filter((logicalConditioner) =>
				this[
					`${params.logicalKind}FilterValues`
				].selectedLogicalIds.includes(logicalConditioner.id)
			)
		}
	}

	async fireLogicalDialogComponent(params: {
		logicalToEdit?: RawLogical<
			LogicalConditionerClass | LogicalPhysicalClass
		>
		logicalKind: LogicalKind
	}) {
		dialogStore.mountInnerComponent({
			innerComponent: LogicalDialog,
			innerComponentProps: {
				logicalToEdit: params.logicalToEdit,
				logicalKind: params.logicalKind
			}
		})
		await dialogStore.openDialog()
	}

	hasLNodeTypeOfClass(
		lnClass: LogicalConditionerClass | LogicalPhysicalClass
	): boolean {
		const lNodeType =
			pluginLocalStore.rootSubElements.dataTypeTemplates?.querySelector(
				`LNodeType[lnClass="${lnClass}"]`
			)

		return Boolean(lNodeType)
	}

	unselectLogical(logicalKind: LogicalKind, logicalId: string) {
		this[`${logicalKind}FilterValues`].selectedLogicalIds = this[
			`${logicalKind}FilterValues`
		].selectedLogicalIds.filter((id) => id !== logicalId)
	}

	resetStates() {
		this.conditionerFilterValues = this.initFilterValues('conditioner')
		this.physicalFilterValues = this.initFilterValues('physical')
	}

	//====== PROXY ======//

	createRequiredLNodeType = createRequiredLNodeType
	// common
	createLogicals = createLogicals
	updateLogical = updateLogical
	removeLogical = removeLogical
}

export const logicalStore = new LogicalStore()
