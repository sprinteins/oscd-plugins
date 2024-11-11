import { writable, derived } from 'svelte/store'
// CORE
import { SCD_ELEMENTS } from '@oscd-plugins/core'
// STORES
import { dataTypeTemplatesStore } from './data-type-templates.store'

//==== STATE

const columnsVisibility = writable({
	substation: true,
	voltageLevel: true,
	bay: true,
	ied: true,
	lDevice: true,
	lNode: true
})

const columns = derived(
	[dataTypeTemplatesStore.dataTypeTemplatesSubElements, columnsVisibility],
	([$dataTypeTemplatesSubElements, $columnsVisibility]) => {
		return {
			substation: {
				name: SCD_ELEMENTS.substation.element.name,
				visible: $columnsVisibility.substation,
				types: $dataTypeTemplatesSubElements.substationTypes
			},
			voltageLevel: {
				name: SCD_ELEMENTS.voltageLevel.element.name,
				visible: $columnsVisibility.voltageLevel,
				types: $dataTypeTemplatesSubElements.voltageLevelTypes
			},
			bay: {
				name: SCD_ELEMENTS.bay.element.name,
				visible: $columnsVisibility.bay,
				types: $dataTypeTemplatesSubElements.bayTypes
			},
			ied: {
				name: SCD_ELEMENTS.ied.element.name,
				visible: $columnsVisibility.ied,
				types: $dataTypeTemplatesSubElements.iedTypes
			},
			lDevice: {
				name: SCD_ELEMENTS.lDevice.element.name,
				visible: $columnsVisibility.lDevice,
				types: $dataTypeTemplatesSubElements.lDeviceTypes
			},
			lNode: {
				name: SCD_ELEMENTS.lNode.element.name,
				visible: $columnsVisibility.lNode,
				types: $dataTypeTemplatesSubElements.lNodeTypes
			}
		}
	}
)

//==== PUBLIC ACTIONS

function toggleColumnVisibility(columnKey: keyof typeof SCD_ELEMENTS) {
	columnsVisibility.update((columnsVisibility) => ({
		...columnsVisibility,
		[columnKey]: !columnsVisibility[columnKey]
	}))
}

export const elementsTypesStore = {
	columns,
	toggleColumnVisibility
}
