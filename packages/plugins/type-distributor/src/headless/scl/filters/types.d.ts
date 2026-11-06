import type { LDeviceData } from '@/headless/common-types'

export type SearchType = 'IED' | 'AccessPoint' | 'LDevice' | 'LNode'

export type FilteredAccessPoint = {
	element: Element
	name: string | null
	lDevices: LDeviceData[]
	serverAtApName?: string
}

export type AccessPointGroup =
	| {
			type: 'host'
			host: FilteredAccessPoint
			serverAtAccessPoints: FilteredAccessPoint[]
	  }
	| {
			type: 'unresolved-server-at'
			accessPoint: FilteredAccessPoint
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
