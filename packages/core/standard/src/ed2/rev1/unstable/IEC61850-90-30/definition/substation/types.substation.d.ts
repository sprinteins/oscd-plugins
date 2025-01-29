import type { Common } from '../shared'

export namespace Substation {
	export type Root = {
		tag: 'Substation'
		attributes: {
			name: 'TEMPLATE' | string
		}
	}

	//==== CONTAINERS

	export type LNodeContainer = Common.BaseElementWithDesc & {
		attributes: {
			name: string
			uuid: string
			originUuid?: string
		}
		subElements: {
			lNode?: LNode[]
		}
	}
}
