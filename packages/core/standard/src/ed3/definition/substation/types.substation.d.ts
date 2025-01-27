import type { Common, UnsignedByte, LNClass } from '../shared'

export namespace Substation {
	export type Root = {
		tag: 'Substation'
		attributes: {
			name: string
		}
		subElements: {
			voltageLevel?: VoltageLevel[]
		}
	}

	export type VoltageLevel = {
		tag: 'VoltageLevel'
		attributes: {
			name: string
		}
		subElements: {}
	}
}
