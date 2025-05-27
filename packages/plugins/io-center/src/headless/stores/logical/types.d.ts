import type {
	LOGICAL_CONDITIONER_CLASS,
	LOGICAL_PHYSICAL_CLASS,
	LOGICAL_KIND
} from '@/headless/constants'
import type { PortConfig } from '@/headless/stores'

export type LogicalKind = keyof typeof LOGICAL_KIND

export type LogicalConditionerClass = keyof typeof LOGICAL_CONDITIONER_CLASS
export type LogicalPhysicalClass = keyof typeof LOGICAL_PHYSICAL_CLASS

export type LogicalFilterValues<
	GenericLogicalClass extends
		| LogicalConditionerClass[]
		| LogicalPhysicalClass[]
> = {
	searchInput: string
	scope: 'all' | 'linked' | 'unlinked'
	selectedLogicalClass: GenericLogicalClass
	availableLogicalClass: GenericLogicalClass
	selectedLogicalIds: string[]
}

export type RawLogical<
	GenericLogicalClass extends LogicalConditionerClass | LogicalPhysicalClass
> = {
	id: string
	element: Element
	name: string
	attributes: {
		uuid: string
		lnClass: GenericLogicalClass
		inst: string
		lnType: string
		desc: string | null
		prefix: string | null
		numberOfPorts: string | null
	}
	ports: PortConfig[]
}
