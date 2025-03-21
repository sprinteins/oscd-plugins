import { newEditEvent } from '@openenergytools/open-scd-core'
// TYPES
import type {
	Insert,
	SetAttributes,
	SetTextContent,
	Remove,
	EditV2,
	EditEventOptions
} from '@openenergytools/open-scd-core'

export function createAndDispatchEditEvent({
	host,
	edit,
	options
}: {
	host: Element
	edit: Insert | SetAttributes | SetTextContent | Remove | EditV2[]
	options?: EditEventOptions
}) {
	host.dispatchEvent(newEditEvent(edit, options))
}

/**
 * @example of EditV2
 * edit: {
 *	node: document.createElement("LD"),
 *	parent: document.getElementById("IED-1"),
 *	reference: null,
 *}
 */
