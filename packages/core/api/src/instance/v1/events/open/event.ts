import type { OpenEvent } from './types'

export function openEvent(doc: XMLDocument, docName: string): OpenEvent.Root {
	return new CustomEvent<OpenEvent.Detail>('oscd-open', {
		bubbles: true,
		composed: true,
		detail: { doc, docName }
	})
}
