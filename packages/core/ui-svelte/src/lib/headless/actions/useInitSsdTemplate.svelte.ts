import { mount, unmount } from 'svelte'
// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	createStandardElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
// COMPONENTS
import { WrongFileLoaded } from '$lib/ui/index.js'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'
import type { Ed2Rev1 } from '../stores/index.js'

export function initSsdTemplate(
	node: HTMLElement,
	params: {
		definition: {
			edition: 'ed2Rev1'
			revision?: IEC61850.AvailableUnstableRevision<
				typeof params.definition.edition
			>
		}
		getRootElement: () => Ed2Rev1.RootElement | null | undefined
		getRootSubElements: () => Partial<Ed2Rev1.RootSubElements> | undefined
		getSubstationsSubElements: () => Ed2Rev1.SubstationsSubElements
	}
) {
	//====== CONSTANTS ======//

	// biome-ignore lint/suspicious/noExplicitAny: generic type of mounted component
	let wrongFileLoadedPage: Record<string, any>
	let wrongFileLoadedContainer: Element | null

	//====== DERIVED STATES ======//

	const isSsdFile = $derived(pluginGlobalStore.xmlDocumentExtension === 'ssd')

	const host = $derived(pluginGlobalStore.host)
	const rootElement = $derived(params.getRootElement())
	const rootSubElements = $derived(params.getRootSubElements())
	const substationsSubElements = $derived(params.getSubstationsSubElements())

	const hasSubstationTemplate = $derived(
		rootSubElements?.substation?.[0]?.getAttribute('name') === 'TEMPLATE'
	)
	const hasVoltageLevelTemplate = $derived(
		substationsSubElements?.[0]?.voltageLevel?.[0]?.getAttribute('name') ===
			'TEMPLATE'
	)

	const hasSsdTemplate = $derived(
		hasSubstationTemplate && hasVoltageLevelTemplate
	)

	//====== FUNCTIONS ======//

	function getSubstationPayload() {
		if (!rootElement) throw new Error('No root element')

		return {
			parent: rootElement,
			reference: rootSubElements?.substation?.[0] || null
		}
	}

	function getVoltageLevelPayload() {
		if (!rootSubElements?.substation?.[0])
			throw new Error('No substation element')

		return {
			parent: rootSubElements.substation[0],
			reference: null
		}
	}

	function createTemplateElement(
		elementToCreate: 'substation' | 'voltageLevel'
	) {
		if (!params.definition.revision) throw new Error('No revision provided')
		if (!host) throw new Error('No host')
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

		const payload =
			elementToCreate === 'substation'
				? getSubstationPayload()
				: getVoltageLevelPayload()

		const newElement = createStandardElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			element: {
				family: elementToCreate
			},
			attributes: {
				name: 'TEMPLATE'
			},
			currentEdition: params.definition.edition,
			currentUnstableRevision: params.definition.revision
		})

		createAndDispatchEditEvent({
			host,
			edit: {
				node: newElement,
				parent: payload.parent,
				reference: payload.reference
			}
		})
	}

	function createContainer() {
		const container = node.insertAdjacentElement(
			'afterend',
			document.createElement('div')
		)
		return container
	}

	function createWrongFileLoadedPage() {
		node.style.display = 'none'
		wrongFileLoadedContainer = createContainer()

		if (wrongFileLoadedContainer)
			wrongFileLoadedPage = mount(WrongFileLoaded, {
				target: wrongFileLoadedContainer,
				props: {
					extension: 'SSD'
				}
			})
	}

	function removeWrongFileLoadedPage() {
		if (wrongFileLoadedContainer) {
			unmount(wrongFileLoadedPage, { outro: true })
			wrongFileLoadedContainer.remove()
			node.style.display = 'block'
		}
	}

	$effect(() => {
		if (!isSsdFile) createWrongFileLoadedPage()
		else if (isSsdFile && !hasSsdTemplate) {
			if (!hasSubstationTemplate) createTemplateElement('substation')
			if (hasSubstationTemplate && !hasVoltageLevelTemplate)
				createTemplateElement('voltageLevel')

			node.style.display = 'block'
		} else if (isSsdFile) removeWrongFileLoadedPage()

		return () => {
			if (wrongFileLoadedPage)
				unmount(wrongFileLoadedPage, { outro: true })
		}
	})
}
