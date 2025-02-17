import type { Common } from '../shared'

export namespace Header {
	export type Root = {
		tag: 'Header'
		attributes: {
			id: string
			version?: string
			revision?: string
			toolID?: string
			nameStructure?: 'IEDName'
		}
		subElements: {
			text?: Common.Text
			history?: History
		}
	}

	export type History = {
		tag: 'History'
		attributes: Record<never, never>
		subElements: {
			hItem?: HistoryItem[]
		}
	}

	export type HistoryItem = Common.AnyElement & {
		tag: 'Hitem'
		attributes: {
			version: string
			revision: string
			when: string
			who?: string
			what?: string
			why?: string
		}
	}
}
