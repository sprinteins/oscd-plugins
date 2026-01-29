import type { Insert } from '@openscd/oscd-api'
import { ssdImportStore } from '@/headless/stores'
import { getTypeReference, type TypeName } from './insertion-references'

function cloneTypeFromSSD(typeId: string, typeName: TypeName): Element | null {
	const ssdDoc = ssdImportStore.loadedSSDDocument
	if (!ssdDoc) {
		throw new Error('No SSD document loaded in store')
	}
	const sourceElement = ssdDoc.querySelector(`${typeName}[id="${typeId}"]`)
	if (!sourceElement) return null
	return sourceElement.cloneNode(true) as Element
}

export function createTypeEdits(
	dataTypeTemplates: Element,
	typeIds: Set<string>,
	typeName: TypeName
): Insert[] {
	const edits: Insert[] = []
	const reference = getTypeReference(dataTypeTemplates, typeName)

	for (const id of typeIds) {
		const clonedElement = cloneTypeFromSSD(id, typeName)
		if (clonedElement) {
			edits.push({
				parent: dataTypeTemplates,
				reference,
				node: clonedElement
			})
		}
	}

	return edits
}
