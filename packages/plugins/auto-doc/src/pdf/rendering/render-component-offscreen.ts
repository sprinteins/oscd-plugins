import { unmount, mount } from 'svelte'
import { renderPngFromHtml } from './render-png-from-html'
import type CommunicationElement from '@/ui/components/elements/communication-element/communication-element.svelte'
import type NetworkElement from '@/ui/components/elements/network-element/network-element.svelte'

const DEFAULT_RENDERING_WIDTH = '2400px'
const DEFAULT_RENDERING_HEIGHT = '1600px'
const COMMUNICATION_ELEMENT_CLASS = 'communication-preview-wrapper'
const NETWORK_ELEMENT_CLASS = 'network-preview-wrapper'
const PIXEL_RATIO = 4
const QUALITY = 1
const RENDER_TIMEOUT = 5000
const LAYOUT_SETTLE_DELAY = 500

interface RenderContext {
	container: HTMLElement
	componentInstance: ReturnType<typeof mount> | null
}

function createOffscreenContainer(): HTMLElement {
	const container = document.createElement('div')
	container.style.position = 'absolute'
	container.style.left = '-9999px'
	container.style.top = '-9999px'
	container.style.width = DEFAULT_RENDERING_WIDTH
	container.style.height = DEFAULT_RENDERING_HEIGHT
	document.body.appendChild(container)
	return container
}

function mountComponent(
	context: RenderContext,
	component: typeof CommunicationElement | typeof NetworkElement,
	props: Record<string, unknown>,
	triggerDiagramReady: () => boolean
): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			context.componentInstance = mount(component, {
				target: context.container,
				props: {
					...props,
					onContentChange: () => {
						// No-op during offscreen rendering for PDF
					},
					triggerDiagramReady: () => {
						if (triggerDiagramReady()) {
							resolve()
						}
					}
				}
			})

			// Fallback timeout in case triggerDiagramReady is never called
			setTimeout(() => {
				if (triggerDiagramReady()) {
					console.warn(
						'[pdfGenerator] Component render timeout, capturing anyway...'
					)
					resolve()
				}
			}, RENDER_TIMEOUT)
		} catch (error) {
			console.error('[pdfGenerator] Error mounting Component:', error)
			reject(error)
		}
	})
}

function waitForLayoutSettle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, LAYOUT_SETTLE_DELAY))
}

function findTargetElement(container: HTMLElement): HTMLElement {
	const diagramElement = container.querySelector(
		`.${COMMUNICATION_ELEMENT_CLASS}, .${NETWORK_ELEMENT_CLASS}`
	) as HTMLElement
	const targetElement =
		diagramElement || (container.firstElementChild as HTMLElement)

	if (!targetElement) {
		throw new Error('No element found to capture in Component')
	}

	return targetElement
}

async function captureAsBase64(element: HTMLElement): Promise<string> {
	const pngBase64 = await renderPngFromHtml({
		element,
		pixelRatio: PIXEL_RATIO,
		quality: QUALITY
	})
	return `data:image/png;base64,${pngBase64}`
}

function cleanup(context: RenderContext): void {
	if (context.componentInstance) {
		unmount(context.componentInstance)
		context.componentInstance = null
	}
	if (context.container?.parentNode) {
		document.body.removeChild(context.container)
	}
}

function handleError(error: unknown, context: RenderContext): never {
	console.error('[pdfGenerator] Error capturing PNG for Component:', error)
	throw error
}

export async function renderComponentOffscreen(
	component: typeof CommunicationElement | typeof NetworkElement,
	props: Record<string, unknown>
): Promise<string> {
	const context: RenderContext = {
		container: createOffscreenContainer(),
		componentInstance: null
	}

	let renderCompleted = false
	const ensureOnce = () => {
		if (renderCompleted) return false
		renderCompleted = true
		return true
	}

	try {
		await mountComponent(context, component, props, ensureOnce)
		await waitForLayoutSettle()
		const element = findTargetElement(context.container)
		return await captureAsBase64(element)
	} catch (error) {
		handleError(error, context)
	} finally {
		cleanup(context)
	}
}
