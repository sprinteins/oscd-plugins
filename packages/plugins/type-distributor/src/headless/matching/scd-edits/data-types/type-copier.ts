import type { Insert } from '@openscd/oscd-api'
import { ssdImportStore } from '@/headless/stores'

export interface CopyContext {
	doc: Document
	dataTypeTemplates: Element
	edits: Insert[]
}

function elementExists(doc: Document, selector: string): boolean {
	return doc.querySelector(selector) !== null
}

export function cloneAndInsertElement(
	elementId: string,
	elementType: string,
	getReferenceFunc: (container: Element) => Node | null,
	ctx: CopyContext
): Element | null {
	if (elementExists(ctx.doc, `${elementType}[id="${elementId}"]`)) {
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
	const reference = getReferenceFunc(ctx.dataTypeTemplates)

	// Insert immediately to maintain proper order for subsequent reference calculations
	ctx.dataTypeTemplates.insertBefore(clonedElement, reference)

	const edit: Insert = {
		parent: ctx.dataTypeTemplates,
		reference: reference,
		node: clonedElement
	}

	ctx.edits.push(edit)

	return clonedElement
}

export function copyElements(
	elementIds: string[],
	elementType: string,
	getReferenceFunc: (container: Element) => Node | null,
	ctx: CopyContext
): void {
	for (const elementId of elementIds) {
		cloneAndInsertElement(
			elementId,
			elementType,
			getReferenceFunc,
			ctx
		)
	}
}
