import { mount, unmount } from 'svelte'
// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// COMPONENTS
import { WrongFileLoaded } from '$lib/ui/index.js'

export function initSsdTemplate(node: HTMLElement) {
	//====== CONSTANTS ======//

	// biome-ignore lint/suspicious/noExplicitAny: generic type of mounted component
	let wrongFileLoadedPage: Record<string, any>
	let wrongFileLoadedContainer: Element | null

	//====== DERIVED STATES ======//

	const isSsdFile = $derived(pluginGlobalStore.xmlDocumentExtension === 'ssd')

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
		else if (isSsdFile) {
			node.style.display = 'block'
			if (wrongFileLoadedPage) removeWrongFileLoadedPage()
		}

		return () => {
			if (wrongFileLoadedPage)
				unmount(wrongFileLoadedPage, { outro: true })
		}
	})
}
