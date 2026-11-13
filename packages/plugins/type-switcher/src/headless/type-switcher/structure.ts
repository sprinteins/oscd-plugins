import type { HashedElement } from '@oscd-plugins/core'

export type TypeStructureEntry = {
	name: string
	type: string
}

export function getTypeStructure(
	type: HashedElement | undefined
): TypeStructureEntry[] {
	if (!type) return []

	return Array.from(type.element.element.children).map((child) => ({
		name: child.getAttribute('name') ?? child.textContent ?? '~',
		type: child.getAttribute('bType') ?? child.tagName
	}))
}
