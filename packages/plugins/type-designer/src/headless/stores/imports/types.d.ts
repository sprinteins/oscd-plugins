// CONSTANTS
import type { ALLOWED_USER_DECISIONS } from '@/headless/constants'

export type EditEvent = {
	parent: Element
	node: Element
	reference: Element | null
}

export type UpdateEvent = {
	element: Element
	attributes: Partial<Record<string, string | null>>
	attributesNS: Partial<
		Record<string, Partial<Record<string, string | null>>>
	>
}

export type RemoveEvent = {
	node: Element
}

export type UserDecision = (typeof ALLOWED_USER_DECISIONS)[number]

export type ImportScope = 'toAdd' | 'toUpdate'
