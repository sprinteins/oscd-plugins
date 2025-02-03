// SVELTE
import { mount, unmount } from 'svelte'
// LIB
import { toast } from 'svelte-sonner'
// CSS
import inlineCssLegacyTheme from '$lib/theme/styles/legacy-oscd-instance.theme.css?inline'
import inlineCssShadcnTheme from '$lib/theme/styles/shadcn-stock.theme.css?inline'
import inlineCssFonts from '$lib/theme/styles/fonts.css?inline'
import inlineShadCnAdaptation from '$lib/theme/styles/shadcn-adaptation-to-instance-specificities.css?inline'
// COMPONENTS
import { Toaster } from '$lib/ui/shadcn/sonner/index.js'
// UTILS
import { setInlineStylesVariables } from '$lib/utils/style.js'
// HEADLESS
import { pluginGlobalStore } from '$lib/headless/stores/index.js'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

export function initPlugin(
	node: HTMLElement,
	params: {
		theme: 'legacy-oscd-instance' | 'shadcn-stock'
		getDoc: () => XMLDocument
		getDocName: () => string
		getEditCount: () => number
		getIsCustomInstance: () => boolean
		definition: {
			edition: IEC61850.AvailableEdition
			revision?: IEC61850.AvailableUnstableRevision<
				typeof params.definition.edition
			>
		}
		getHost: () => HTMLElement | undefined
		getRootElement: () => Element | null | undefined
		customNamespaces?: Record<'namespacePrefix' | 'namespaceUri', string>[]
	}
) {
	//====== INIT GETTERS ======//

	const doc = $derived(params.getDoc())
	const docName = $derived(params.getDocName())
	const editCount = $derived(params.getEditCount())
	const isCustomInstance = $derived(params.getIsCustomInstance())
	const host = $derived(params.getHost())
	const rootElement = $derived(params.getRootElement())

	const revisionNamespace = $derived.by(() => {
		if (params.definition?.revision) {
			return [
				{
					namespacePrefix:
						pluginGlobalStore.revisionsStores[
							params.definition.revision
						].currentNamespacePrefix,
					namespaceUri:
						pluginGlobalStore.revisionsStores[
							params.definition.revision
						].currentNamespaceUri
				}
			]
		}
	})
	const namespaceToAdd = $derived([
		...(revisionNamespace || []),
		...(params.customNamespaces || [])
	])

	const needsNamespaceAttributes = $derived(!!namespaceToAdd?.length)
	const hasNamespaceAttributes = $derived.by(() => {
		if (rootElement && needsNamespaceAttributes) {
			checkIfRootElementHasAllCustomNamespaces(
				rootElement,
				namespaceToAdd
			)
		}
		return false
	})

	//====== DYNAMIC STYLE ======//

	const mode = $derived({
		isStorybook: import.meta.env.MODE === 'STORYBOOK',
		isLegacyInstance:
			import.meta.env.MODE !== 'STORYBOOK' &&
			import.meta.env.MODE !== 'development' &&
			!isCustomInstance
	})

	const currentMode = $derived(
		Object.entries(mode).find(([key, value]) => value)?.[0]
	)

	const cssVariables = $derived(
		setInlineStylesVariables({
			//header
			'instance-header-height': setInstanceHeaderHeight(),
			//plugin
			'plugin-container-height': setPluginContainerHeight(),
			//shadcn sidebar
			'sidebar-root-top': setSidebarRootTop()
		})
	)

	//====== BASE STYLE ======//

	const selectedTheme = $derived.by(() => {
		switch (params.theme) {
			case 'legacy-oscd-instance':
				return inlineCssLegacyTheme
			case 'shadcn-stock':
				return inlineCssShadcnTheme
			default:
				return ''
		}
	})
	const style = document.createElement('style')
	style.innerHTML = `
		${selectedTheme}
		${inlineCssFonts}
		${inlineShadCnAdaptation}
	`
	node.insertAdjacentElement('beforebegin', style)

	//====== FUNCTIONS ======//

	// instance

	function setInstanceHeaderHeight() {
		switch (currentMode) {
			case 'isLegacyInstance':
				return '116px'
			default:
				return ''
		}
	}

	// plugin

	function setPluginContainerHeight() {
		switch (currentMode) {
			case 'isStorybook':
				return 'inherit'
			case 'isLegacyInstance':
				return 'calc(100vh - var(--instance-header-height))'
			default:
				return '100vh'
		}
	}

	// shadcn sidebar adaptation

	function setSidebarRootTop() {
		switch (currentMode) {
			case 'isLegacyInstance':
				return 'auto'
			default:
				return '0'
		}
	}

	// namespace

	function checkIfRootElementHasAllCustomNamespaces(
		currentRootElement: Element,
		currentCustomNamespace: Record<string, string>[]
	) {
		return currentCustomNamespace.some((namespaceEntries) => {
			Object.entries(namespaceEntries).some(
				([namespace, namespaceUri]) => {
					return (
						currentRootElement.getAttribute(
							`xmlns:${namespace}`
						) !== namespaceUri
					)
				}
			)
		})
	}

	// TODO: not working for now
	function createNamespaceAttributes(currentRootElement: Element) {
		const payload: Record<string, Record<string, string>> = {}

		for (const namespaceEntries of namespaceToAdd) {
			payload['http://www.w3.org/2000/xmlns/'] = {
				[namespaceEntries.namespacePrefix]:
					namespaceEntries.namespaceUri
			}
		}

		pluginGlobalStore.updateElementType({
			element: currentRootElement,
			attributesNS: payload
		})
	}

	//====== XML DOCUMENT INIT ======//

	const xmlDocumentUpdateTrigger = ({
		currentEditCount, // is not used but should be passed to the function to trigger reactivity
		currentXmlDocument,
		currentXmlDocumentName
	}: {
		currentEditCount: number
		currentXmlDocument: XMLDocument | undefined
		currentXmlDocumentName: string
	}) => {
		if (currentXmlDocument) {
			pluginGlobalStore.xmlDocument = currentXmlDocument
			pluginGlobalStore.xmlDocumentName = currentXmlDocumentName
			pluginGlobalStore.editCount = currentEditCount
			pluginGlobalStore.host = host
		}
	}

	//====== ERROR HANDLES ======//

	function globalError(event: Event) {
		const errorEvent = event as ErrorEvent
		toast.error(errorEvent.message)
		console.error('Global error:', {
			message: errorEvent.message,
			source: errorEvent.filename,
			lineNo: errorEvent.lineno,
			colNo: errorEvent.colno,
			error: errorEvent.error
		})
	}

	function unHandledRejection(event: Event) {
		const promiseRejectionEvent = event as PromiseRejectionEvent
		toast.error(promiseRejectionEvent.reason)
		console.error('Unhandled Rejection at:', promiseRejectionEvent.reason)
	}

	//====== WATCHER ======//

	// set main inline style
	$effect(() => {
		node.style.cssText = `
			${cssVariables};
			font-family: "Roboto", sans-serif;
			height: var(--plugin-container-height);
			display: block;
			position: relative;
		`
	})

	// add toaster sonner component
	// TODO: not working for now
	// biome-ignore lint/suspicious/noExplicitAny: generic type of mounted component
	let toaster: Record<string, any>
	$effect(() => {
		if (!toaster && host?.shadowRoot)
			toaster = mount(Toaster, {
				target: host.shadowRoot
			})

		return () => {
			if (toaster) unmount(toaster, { outro: true })
		}
	})

	// set XML Document after user action through the instance
	$effect(() => {
		xmlDocumentUpdateTrigger({
			currentEditCount: editCount,
			currentXmlDocument: doc,
			currentXmlDocumentName: docName
		})
	})

	// add custom namespace attribute to root element
	$effect(() => {
		if (host && needsNamespaceAttributes && rootElement) {
			if (!hasNamespaceAttributes) createNamespaceAttributes(rootElement)
		}
	})

	// set error handler
	// TODO: not working for now
	$effect(() => {
		host?.addEventListener('error', globalError)
		host?.addEventListener('unhandledrejection', unHandledRejection)

		return () => {
			host?.removeEventListener('error', globalError)
			host?.removeEventListener('unhandledrejection', unHandledRejection)
		}
	})
}
