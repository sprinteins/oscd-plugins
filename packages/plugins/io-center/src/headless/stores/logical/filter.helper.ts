// STORES
import { canvasStore } from '@/headless/stores'
// TYPES
import type {
	RawLogical,
	LogicalConditionerClass,
	LogicalPhysicalClass
} from './types'

export function filterLogical<
	GenericLogicalClass extends LogicalConditionerClass | LogicalPhysicalClass
>(params: {
	rawLogicals: RawLogical<GenericLogicalClass>[]
	searchedTerm: string
	filterScope: 'all' | 'linked' | 'unlinked'
	selectedLogicalClass: GenericLogicalClass[]
}): RawLogical<GenericLogicalClass>[] {
	return params.rawLogicals
		.filter((item) => {
			const label = `${item.attributes.lnClass} - ${item.attributes.inst}`
			return label
				.toLowerCase()
				.includes(params.searchedTerm.toLowerCase())
		})
		.filter(
			(item) =>
				({
					all: true,
					linked: canvasStore.isAtLeastOnePortConnected(item.ports),
					unlinked: !canvasStore.isAtLeastOnePortConnected(item.ports)
				})[params.filterScope]
		)
		.filter((item) => {
			if (params.selectedLogicalClass.length === 0) return true
			return params.selectedLogicalClass.includes(item.attributes.lnClass)
		})
}
