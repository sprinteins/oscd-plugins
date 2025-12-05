import { unmount, mount } from 'svelte'
import { exportPngFromHTMLElement } from './diagram-export'
import type CommunicationElement from '@/ui/components/elements/communication-element/communication-element.svelte'
import type NetworkElement from '@/ui/components/elements/network-element/network-element.svelte'

export async function renderComponentOffscreen(
	component: typeof CommunicationElement | typeof NetworkElement,
	props: Record<string, unknown>
): Promise<string> {
	const DEFAULT_RENDERING_WIDTH = '1200px'
	const DEFAULT_RENDERING_HEIGHT = '800px'

	const COMMUNICATION_ELEMENT_CLASS = 'communication-preview-wrapper'
	const NETWORK_ELEMENT_CLASS = 'network-preview-wrapper'

	const PIXEL_RATIO = 10
	const QUALITY = 1

	const container = document.createElement('div')
	container.style.position = 'absolute'
	container.style.left = '-9999px'
	container.style.top = '-9999px'
	container.style.width = DEFAULT_RENDERING_WIDTH
	container.style.height = DEFAULT_RENDERING_HEIGHT
	document.body.appendChild(container)

	return new Promise((resolve, reject) => {
		try {
			let renderCompleted = false
			const timeoutDuration = 5000

			const handleRenderComplete = async () => {
				if (renderCompleted) return
				renderCompleted = true

				// Wait a bit more for any animations/layout to settle
				await new Promise((r) => setTimeout(r, 500))

				try {
					const diagramElement = container.querySelector(
						`.${COMMUNICATION_ELEMENT_CLASS}, .${NETWORK_ELEMENT_CLASS}`
					) as HTMLElement
					const targetElement =
						diagramElement ||
						(container.firstElementChild as HTMLElement)

					if (!targetElement) {
						throw new Error(
							'No element found to capture in Component'
						)
					}

					const pngBase64 = await exportPngFromHTMLElement({
						element: targetElement,
						pixelRatio: PIXEL_RATIO,
						quality: QUALITY
					})

					unmount(componentInstance)
					document.body.removeChild(container)

					resolve(`data:image/png;base64,${pngBase64}` as Base64URLString)
				} catch (error) {
					console.error(
						'[pdfGenerator] Error capturing PNG for Component:',
						error
					)
					unmount(componentInstance)
					document.body.removeChild(container)
					reject(error)
				}
			}

			const componentInstance = mount(component, {
				target: container,
				props: {
					...props,
					onContentChange: () => {
						// No-op during offscreen rendering for PDF
					},
					onRenderComplete: handleRenderComplete
				}
			})

			// Fallback timeout in case onRenderComplete is never called
			setTimeout(() => {
				if (!renderCompleted) {
					console.warn(
						'[pdfGenerator] Component render timeout, capturing anyway...'
					)
					handleRenderComplete()
				}
			}, timeoutDuration)
		} catch (error) {
			console.error('[pdfGenerator] Error mounting Component:', error)
			document.body.removeChild(container)
			reject(error)
		}
	})
}
