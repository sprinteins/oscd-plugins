import type { Insert } from '@openscd/oscd-api'
import type { XMLEditor } from '@openscd/oscd-editor'
import { ssdImportStore } from '../../stores'
import { elementExists } from '../utils/document-helpers'

/**
 * Clones and inserts an element from SSD to SCD
 * @param elementId The ID of the element to copy
 * @param elementType The type of element (LNodeType, DOType, etc.)
 * @param doc The target document
 * @param editor The editor instance
 * @param dataTypeTemplates The DataTypeTemplates container
 * @param getReferenceFunc Function to get the insertion reference
 * @returns The cloned element or null if not found/already exists
 */
export function cloneAndInsertElement(
	elementId: string,
	elementType: string,
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element,
	getReferenceFunc: (container: Element) => Node | null
): Element | null {
	// Skip if already exists
	if (elementExists(doc, `${elementType}[id="${elementId}"]`)) {
		return null
	}

	// Find element in SSD
	const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
		`${elementType}[id="${elementId}"]`
	)
	if (!sourceElement) {
		console.warn(`${elementType} with id ${elementId} not found in SSD`)
		return null
	}

	// Clone and insert
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

/**
 * Copies multiple elements of the same type from SSD to SCD
 * @param elementIds Array of element IDs to copy
 * @param elementType The type of elements to copy
 * @param doc The target document
 * @param editor The editor instance
 * @param dataTypeTemplates The DataTypeTemplates container
 * @param getReferenceFunc Function to get the insertion reference
 */
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
