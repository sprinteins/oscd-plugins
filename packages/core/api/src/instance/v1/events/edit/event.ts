import type { EditEvent } from './types'

export function editEvent<GenericEditAction extends EditEvent.AvailableAction>(
	edit: GenericEditAction,
	options?: EditEvent.Options
): EditEvent.Root<GenericEditAction> {
	return new CustomEvent<EditEvent.Detail<GenericEditAction>>(
		'oscd-edit-v2',
		{
			composed: true,
			bubbles: true,
			detail: { ...options, edit }
		}
	)
}
