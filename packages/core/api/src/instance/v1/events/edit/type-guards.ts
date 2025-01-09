import type { EditEvent } from './types'

export function isComplex(
	edit: EditEvent.AvailableAction
): edit is EditEvent.AvailableAction[] {
	return Array.isArray(edit)
}

export function isSetTextContent(
	edit: EditEvent.AvailableAction
): edit is EditEvent.SetTextContent {
	return (
		(edit as EditEvent.SetTextContent).element !== undefined &&
		(edit as EditEvent.SetTextContent).textContent !== undefined
	)
}

export function isRemove(
	edit: EditEvent.AvailableAction
): edit is EditEvent.Remove {
	return (
		(edit as EditEvent.Insert).parent === undefined &&
		(edit as EditEvent.Remove).node !== undefined
	)
}

export function isSetAttributes(
	edit: EditEvent.AvailableAction
): edit is EditEvent.SetAttributes {
	return (
		(edit as EditEvent.SetAttributes).element !== undefined &&
		(edit as EditEvent.SetAttributes).attributes !== undefined &&
		(edit as EditEvent.SetAttributes).attributesNS !== undefined
	)
}

export function isInsert(
	edit: EditEvent.AvailableAction
): edit is EditEvent.Insert {
	return (
		(edit as EditEvent.Insert).parent !== undefined &&
		(edit as EditEvent.Insert).node !== undefined &&
		(edit as EditEvent.Insert).reference !== undefined
	)
}

// biome-ignore lint/suspicious/noExplicitAny: used for type guards
export function isEdit(edit: any): edit is EditEvent.AvailableAction {
	if (isComplex(edit)) return !edit.some((e) => !isEdit(e))

	return (
		isSetAttributes(edit) ||
		isSetTextContent(edit) ||
		isInsert(edit) ||
		isRemove(edit)
	)
}
