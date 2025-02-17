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
import { xmlDocumentStore, pluginStore } from '$lib/headless/stores/index.js'

export function initPlugin(
	node: HTMLElement,
	params: {
		theme: 'legacy-oscd-instance' | 'shadcn-stock'
		getDoc: () => XMLDocument
		getDocName: () => string
		getEditCount: () => number
		getIsCustomInstance: () => boolean
		host: HTMLElement
	}
) {
	//====== DYNAMIC STYLE ======//

	const mode = $derived({
		isStorybook: import.meta.env.MODE === 'STORYBOOK',
		isLegacyInstance:
			import.meta.env.MODE !== 'STORYBOOK' &&
			!import.meta.env.DEV &&
			!params.getIsCustomInstance()
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
	node.appendChild(style)

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

	//====== XML DOCUMENT INIT ======//

	const xmlDocumentUpdateTrigger = ({
		editCount, // is not used but should be passed to the function to trigger reactivity
		newXmlDocument,
		newXmlDocumentName
	}: {
		editCount: number
		newXmlDocument: XMLDocument | undefined
		newXmlDocumentName: string
	}) => {
		if (newXmlDocument) {
			xmlDocumentStore.xmlDocument = newXmlDocument
			xmlDocumentStore.xmlDocumentName = newXmlDocumentName
			xmlDocumentStore.editCount = editCount
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
		if (!toaster && params.host.shadowRoot)
			toaster = mount(Toaster, {
				target: params.host.shadowRoot
			})

		return () => {
			if (toaster) unmount(toaster, { outro: true })
		}
	})

	// set XML Document after user action through the instance
	$effect(() => {
		xmlDocumentUpdateTrigger({
			editCount: params.getEditCount(),
			newXmlDocument: params.getDoc(),
			newXmlDocumentName: params.getDocName()
		})
	})

	// set plugin host HTMLElement
	$effect(() => {
		pluginStore.host = params.host
	})

	// set error handler
	// TODO: not working for now
	$effect(() => {
		pluginStore.host?.addEventListener('error', globalError)
		pluginStore.host?.addEventListener(
			'unhandledrejection',
			unHandledRejection
		)

		return () => {
			pluginStore.host?.removeEventListener('error', globalError)
			pluginStore.host?.removeEventListener(
				'unhandledrejection',
				unHandledRejection
			)
		}
	})
}
