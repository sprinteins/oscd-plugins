import { newEditEvent } from '@openenergytools/open-scd-core'
// TYPES
import type { EditV2, EditEventOptions } from '@openenergytools/open-scd-core'

export function createAndDispatchEditEvent({
	host,
	edit,
	options
}: {
	host: Element
	edit: EditV2
	options?: EditEventOptions
}) {
	host.dispatchEvent(newEditEvent(edit, options))
}
