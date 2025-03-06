import type { Common } from '../shared'

export namespace Substation {
	export type Root = {
		tag: 'Substation'
		attributes: {
			name: 'TEMPLATE' | string
		}
	}

	export type LNode = {
		tag: 'LNode'
		attributes: {
			originUuid?: string
		}
	}

	//==== CONTAINERS

	export type LNodeContainer = Common.BaseElementWithDesc & {
		attributes: {
			name: string
			uuid: string
			templateUuid?: string
			originUuid?: string
		}
		subElements: {
			lNode?: LNode[]
		}
	}
}
