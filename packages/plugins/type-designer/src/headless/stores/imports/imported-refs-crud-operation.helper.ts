// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import {
	REF_ID_TO_TYPE_ID_ATTRIBUTE,
	REF_FAMILY_TO_TYPE_FAMILY_MAP,
	ALLOWED_IMPORTED_REF
} from '@/headless/constants'
// STORES
import { importsStore, typeElementsStore } from '@/headless/stores'

export async function addImportedChildElements(childElementsToAdd: Element[]) {
	for (const child of childElementsToAdd) {
		const camelCasedTagName =
			child.tagName.charAt(0).toLowerCase() + child.tagName.slice(1)

		if (
			typeGuard.isTuplesIncludingString(
				camelCasedTagName,
				ALLOWED_IMPORTED_REF
			)
		) {
			const childId = child.getAttribute(
				REF_ID_TO_TYPE_ID_ATTRIBUTE[camelCasedTagName]
			)
			const equivalentTypeFamily =
				REF_FAMILY_TO_TYPE_FAMILY_MAP[camelCasedTagName]

			const childTypeElements =
				importsStore.importedTypeElementsPerFamily[equivalentTypeFamily]
					.available

			if (
				childId &&
				typeGuard.isPropertyOfObject(childId, childTypeElements)
			) {
				await typeElementsStore.createNewTypeBasedOnImport({
					typeElementFamily: equivalentTypeFamily,
					elementToAdd: childTypeElements[childId].element
				})
			}
		}
	}
}
