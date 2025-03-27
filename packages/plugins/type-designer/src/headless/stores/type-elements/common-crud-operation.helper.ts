import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createAndDispatchEditEvent,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// HELPERS
import { getNewNameWithOccurrence } from '@/headless/stores/type-elements/type-naming.helper'
// TYPES
import type { AvailableTypeFamily, AvailableRefFamily } from '@/headless/stores'
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'

//====== LOCAL HELPERS ======//

function handleDuplicationSpecificationPerRefFamily(params: {
	family: AvailableRefFamily
	elementToClone: Element
	clonedElement: Element
}) {
	const parentElement = params.elementToClone.parentElement

	return {
		[REF_FAMILY.function]: () => {},
		[REF_FAMILY.eqFunction]: () => {},
		[REF_FAMILY.generalEquipment]: () => {},
		[REF_FAMILY.conductingEquipment]: () => {},
		[REF_FAMILY.lNode]: () => {
			const lnType = params.clonedElement.getAttribute('lnType')

			if (lnType && parentElement) {
				const lnInst =
					Array.from(parentElement.children).filter(
						(child) => child.getAttribute('lnType') === lnType
					).length + 1
				params.clonedElement.setAttribute('lnInst', lnInst.toString())
			}
		}
	}[params.family]()
}

//====== CREATE ======//

/**
 * Duplicates a type element by cloning it and assigning a new unique identifier and name.
 *
 * @param params - The parameters for the duplication.
 * @param params.family - The family of the type element to duplicate.
 * @param params.id - The identifier of the type element to duplicate.
 *
 * @throws If there is no host or parent element.
 */
export function duplicateElement(params: {
	kind: 'type' | 'ref'
	element: Element
	family: Exclude<AvailableTypeFamily, 'lNodeType'> | AvailableRefFamily
}) {
	const elementToClone = params.element
	const clonedElement = elementToClone.cloneNode(true) as Element

	clonedElement.setAttribute('uuid', uuidv4())

	if (
		typeGuard.isPropertyOfObject(params.family, REF_FAMILY) &&
		params.kind === 'ref'
	)
		handleDuplicationSpecificationPerRefFamily({
			family: params.family,
			elementToClone,
			clonedElement
		})

	if (
		typeGuard.isPropertyOfObject(params.family, TYPE_FAMILY) &&
		params.kind === 'type'
	)
		clonedElement.setAttribute(
			'name',
			getNewNameWithOccurrence({
				element: elementToClone,
				family: params.family,
				suffix: 'Copy'
			})
		)

	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!elementToClone.parentElement) throw new Error('No parent element')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent: elementToClone.parentElement,
			node: clonedElement,
			reference: elementToClone.nextElementSibling
		}
	})
}
