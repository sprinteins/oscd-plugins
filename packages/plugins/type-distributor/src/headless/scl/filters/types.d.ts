import type { IedLDeviceData } from '@/headless/common-types'

export type SearchType = 'IED' | 'AccessPoint' | 'LDevice' | 'LN/LN0'

export type FilteredAccessPoint = {
	element: Element
	name: string | null
	lDevices: IedLDeviceData[]
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
