import { editEvent } from '@/instance/v1'
import type { EditEvent } from '@/instance/v1'

export function createEditEvent({
	host,
	edit,
	options
}: {
	host: Element
	edit: EditEvent.AvailableAction
	options: EditEvent.Options
}) {
	host.dispatchEvent(editEvent(edit, options))
}
