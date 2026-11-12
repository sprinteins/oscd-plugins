import type { SCDElement } from '@oscd-plugins/core'

export type ParentElement = {
	name: string
	type: string
}

export const NullParentElement: ParentElement = {
	name: '',
	type: ''
}

export function getParent(doEl: SCDElement) {
	const notFoundName = '~name not found~'
	const parent = doEl.element.parentElement
	if (!parent) return NullParentElement

	const prioritizedNameAttributes = ['id', 'name', 'desc']

	let name = notFoundName
	for (const attr of prioritizedNameAttributes) {
		const value = parent.getAttribute(attr)
		if (value) {
			name = value
			break
		}
	}

	const parentElement: ParentElement = {
		name,
		type: parent.tagName
	}

	return parentElement
}
