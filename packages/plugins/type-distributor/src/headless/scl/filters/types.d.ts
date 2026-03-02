import type { LNodeTemplate } from '@/headless/common-types'

export type SearchType = 'IED' | 'AccessPoint' | 'LDevice' | 'LNode'

export type FilteredAccessPoint = {
	element: Element
	name: string | null
	lNodes: LNodeTemplate[]
}

export type IEDData = {
	name: string
	element: Element
	accessPoints: FilteredAccessPoint[]
}

export type FilteredIED = {
	name: string
	element: Element
	accessPoints: FilteredAccessPoint[]
}
