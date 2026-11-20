import type { HashedElement, HashedElementGroup } from '@oscd-plugins/core'
import type { Replace } from '@/headless/types'

type ReferenceAttribute = 'lnType' | 'type'

const referenceAttributes: Record<string, ReferenceAttribute> = {
	LNodeType: 'lnType',
	DOType: 'type',
	DAType: 'type',
	EnumType: 'type'
}

export function createRelinkActions(
	group: HashedElementGroup,
	sourceIndexes: number[],
	targetIndex: number
): Replace[] {
	const target = getGroupItem(group, targetIndex)

	return sourceIndexes.flatMap((sourceIndex) => {
		const source = getGroupItem(group, sourceIndex)
		const attribute = getReferenceAttribute(source.element.element)

		return source.usages.map((usage) =>
			createReplace(
				usage.element,
				attribute,
				source.element.id,
				target.element.id
			)
		)
	})
}

function getGroupItem(group: HashedElementGroup, index: number): HashedElement {
	const item = group[index]
	if (!item) {
		throw new Error(`No type found at index ${index}`)
	}
	return item
}

function getReferenceAttribute(typeElement: Element): ReferenceAttribute {
	const attribute = referenceAttributes[typeElement.tagName]
	if (!attribute) {
		throw new Error(`Unsupported type element "${typeElement.tagName}"`)
	}
	return attribute
}

function createReplace(
	usage: Element,
	attribute: ReferenceAttribute,
	sourceId: string,
	targetId: string
): Replace {
	if (usage.getAttribute(attribute) !== sourceId) {
		throw new Error(
			`${usage.tagName} does not reference "${sourceId}" through "${attribute}"`
		)
	}

	const modified = usage.cloneNode(true) as Element
	modified.setAttribute(attribute, targetId)

	return {
		old: { element: usage },
		new: { element: modified }
	}
}
