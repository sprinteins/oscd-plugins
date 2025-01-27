import { mount, unmount } from 'svelte'
// CORE
import { xmlDocumentStore, pluginStore } from '@oscd-plugins/core-ui-svelte'
import {
	createStandardElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
// COMPONENTS
import { WrongFileLoaded } from '$lib/ui/index.js'
// TYPES
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

export function initSsdTemplate(node: HTMLElement) {
	const isSsdFile = $derived(xmlDocumentStore.xmlDocumentExtension === 'ssd')

	const hasSubstationTemplate = $derived(
		xmlDocumentStore.rootSubElements?.substation?.[0]?.getAttribute(
			'name'
		) === 'TEMPLATE'
	)
	const hasVoltageLevelTemplate = $derived(
		xmlDocumentStore.substationSubElements?.[0].voltageLevel?.[0]?.getAttribute(
			'name'
		) === 'TEMPLATE'
	)

	const hasSsdTemplate = $derived(
		hasSubstationTemplate && hasVoltageLevelTemplate
	)

	//====== FUNCTIONS ======//

	function createTemplateElement(
		elementToCreate: 'substation' | 'voltageLevel',
		parent: Element,
		reference: Xml.SclElement<'ed2', 'substation'> | null
	) {
		if (xmlDocumentStore.xmlDocument) {
			const newElement = createStandardElement({
				xmlDocument: xmlDocumentStore.xmlDocument,
				element: elementToCreate,
				attributes: {
					name: 'TEMPLATE'
				},
				standardVersion: 'ed3'
			}) as Xml.SclElement<'ed3', typeof elementToCreate>

			if (pluginStore.host) {
				createAndDispatchEditEvent({
					host: pluginStore.host,
					edit: {
						node: newElement,
						parent,
						reference
					}
				})
			}
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: generic type of mounted component
	let wrongFileLoadedPage: Record<string, any>
	$effect(() => {
		// if (!isSsdFile) {
		// 	if (
		// 		node.firstElementChild &&
		// 		node.firstElementChild instanceof HTMLElement
		// 	)
		// 		node.firstElementChild.style.display = 'none'

		// 	wrongFileLoadedPage = mount(WrongFileLoaded, {
		// 		target: node,
		// 		props: {
		// 			errorMessage:
		// 				'It seems you load the wrong type of file: it should be an SSD file.'
		// 		}
		// 	})
		// } else
		if (isSsdFile && !hasSsdTemplate) {
			if (
				!hasSubstationTemplate &&
				xmlDocumentStore.rootElement &&
				xmlDocumentStore.rootSubElements
			)
				createTemplateElement(
					'substation',
					xmlDocumentStore.rootElement,
					xmlDocumentStore.rootSubElements.substation[0]
				)
			if (
				hasSubstationTemplate &&
				!hasVoltageLevelTemplate &&
				xmlDocumentStore.rootSubElements?.substation?.length
			)
				createTemplateElement(
					'voltageLevel',
					xmlDocumentStore.rootSubElements?.substation?.[0],
					null
				)
		}
		// if (
		// 	node.firstElementChild &&
		// 	node.firstElementChild instanceof HTMLElement
		// )
		// 	node.firstElementChild.style.display = 'block'
		// } else if (isSsdFile && wrongFileLoadedPage) {
		// 	unmount(wrongFileLoadedPage, { outro: true })
		// 	if (
		// 		node.firstElementChild &&
		// 		node.firstElementChild instanceof HTMLElement
		// 	)
		// 		node.firstElementChild.style.display = 'block'
		// }

		// return () => {
		// 	if (wrongFileLoadedPage)
		// 		unmount(wrongFileLoadedPage, { outro: true })
		// }
	})
}
