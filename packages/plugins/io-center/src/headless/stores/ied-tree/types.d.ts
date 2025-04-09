import type { NODE_TYPE } from '@/headless/constants'

export type IED = {
	element: Element | null
	id: string
	name: string
}

export type TreeItem = {
	id: string
	name: string | 'unknown'
	level: (typeof NODE_TYPE)[keyof typeof NODE_TYPE]
	objectPath?: ObjectPath
	cdcType?: string
	children?: TreeItem[]
}

export type DataObject = {
	id: string
	name: string | 'unknown'
	level: typeof NODE_TYPE.dO
	objectPath: ObjectPath
	cdcType: string
}

export type ObjectPath = {
	ied: {
		id: string
		name: string
	}
	accessPoint: {
		name: string
	}
	lDevice: {
		id: string
		inst: string
	}
	ln: {
		id: string
		lnClass: string
		inst: string
	}
}
