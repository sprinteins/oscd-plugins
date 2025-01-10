//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY !	MAKE A PR TO MODIFY THE CORE LIBRARY.
// AS FOR NOW THE OPENSCD EVENTS PACKAGE IS NOT PUBLISHED
// WE USE A COPY OF ITS CORE EDITOR FUNCTIONALITIES	- THIS IS THE V1 MARK AS DEPRECATED BUT STILL IN USE
// SEE SOURCE  https://github.com/openscd/open-scd/blob/main/packages/core/foundation/deprecated/open-event.js
// THIS FILE IS IGNORED BY BIOME
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Represents a document to be opened. */
export interface OpenDocDetail {
	doc: XMLDocument
	docName: string
	docId?: string
}
export type OpenDocEvent = CustomEvent<OpenDocDetail>
export function newOpenDocEvent(
	doc: XMLDocument,
	docName: string,
	eventInitDict?: CustomEventInit<Partial<OpenDocDetail>>
): OpenDocEvent {
	return new CustomEvent<OpenDocDetail>('open-doc', {
		bubbles: true,
		composed: true,
		...eventInitDict,
		detail: { doc, docName, ...eventInitDict?.detail }
	})
}

declare global {
    interface ElementEventMap {
      ['open-doc']: OpenDocEvent;
    }
  }
