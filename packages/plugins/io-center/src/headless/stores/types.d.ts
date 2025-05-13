import type {
	PORTS_CONFIG_PER_CLASS,
	PORT_KIND,
	PORT_SIDE
} from '@/headless/constants'
import type {
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

export type DataObject = {
	id: string
	name: string
	level: typeof TREE_LEVEL.dO
	ports: PortConfig[]
}

const PORTS_CONFIG = Object.values(PORTS_CONFIG_PER_CLASS)

export type PortKind = keyof typeof PORT_KIND
export type PortSide = keyof typeof PORT_SIDE

export type PortConfig = {
	kind: PortKind
	allowedTarget: {
		kind: PortKind
		side: PortSide
	}
	name: string
	side: PortSide
	index: number
	commonDataClass?: string
	payload: PortPayload
}

export type PortPayload = {
	uuid: string
	ldInst: string
	lnUuid: string
	lnClass: LogicalConditionerClass | LogicalPhysicalClass | ''
	lnInst: string
}
