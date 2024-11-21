import { newActionEvent } from './api'

export function createEvent({
	host,
	parent,
	element,
	reference
}: {
	host: Element
	parent: Element
	element: Element
	reference?: Element
}) {
	const event = newActionEvent({
		new: {
			parent,
			element,
			reference
		}
	})

	host.dispatchEvent(event)
}

export function updateEvent({
	host,
	element,
	oldAttributes,
	newAttributes
}: {
	host: Element
	element: Element
	oldAttributes: Record<string, string | null>
	newAttributes: Record<string, string | null>
}) {
	const event = newActionEvent({
		element,
		oldAttributes,
		newAttributes
	})

	host.dispatchEvent(event)
}

export function deleteEvent({
	host,
	parent,
	element,
	reference
}: {
	host: Element
	parent: Element
	element: Element
	reference?: Element
}) {
	const event = newActionEvent({
		old: {
			parent,
			element,
			reference
		}
	})

	host.dispatchEvent(event)
}
