import type { HashedElementGroup } from '@oscd-plugins/core'

export type HashedElementTypedCollective = {
	items: HashedElementGroup
	type: string
}[] // basically HashedElement[][]
