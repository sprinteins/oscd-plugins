import type { Store } from './types.element-types'

export type Payload = {
	sourceElementTypeId: string
	targetColumnKey: keyof Store
}
