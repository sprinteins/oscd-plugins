import type { Insert } from '@openscd/oscd-api'
import type { XMLEditor } from '@openscd/oscd-editor'
import { ssdImportStore } from '@/headless/stores'

function elementExists(doc: Document, selector: string): boolean {
	return doc.querySelector(selector) !== null
}

export function cloneAndInsertElement(
	elementId: string,
	elementType: string,
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element,
	getReferenceFunc: (container: Element) => Node | null
): Element | null {
	if (elementExists(doc, `${elementType}[id="${elementId}"]`)) {
		return null
	}

	const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
		`${elementType}[id="${elementId}"]`
	)
	if (!sourceElement) {
		console.warn(`${elementType} with id ${elementId} not found in SSD`)
		return null
	}

	const clonedElement = sourceElement.cloneNode(true) as Element
	const reference = getReferenceFunc(dataTypeTemplates)

	const edit: Insert = {
		parent: dataTypeTemplates,
		reference: reference,
		node: clonedElement
	}

	editor.commit(edit, {
		title: `Copy ${elementType} ${elementId} from SSD`
	})

	return clonedElement
}

export function copyElements(
	elementIds: string[],
	elementType: string,
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element,
	getReferenceFunc: (container: Element) => Node | null
): void {
	for (const elementId of elementIds) {
		cloneAndInsertElement(
			elementId,
			elementType,
			doc,
			editor,
			dataTypeTemplates,
			getReferenceFunc
		)
	}
}
