import { unmount, mount } from 'svelte'
import { exportPngFromHTMLElement } from './diagram-export'
import type CommunicationElement from '@/ui/components/elements/communication-element/communication-element.svelte'
import type NetworkElement from '@/ui/components/elements/network-element/network-element.svelte'

export async function renderComponentOffscreen(
	component: typeof CommunicationElement | typeof NetworkElement,
	props: Record<string, unknown>,
	componentName: string
): Promise<string> {
	console.log(
		`[pdfGenerator] Rendering ${componentName} offscreen with props:`,
		props
	)

	// Create hidden container
	const container = document.createElement('div')
	container.style.position = 'absolute'
	container.style.left = '-9999px'
	container.style.top = '-9999px'
	container.style.width = '1200px' // Fixed width for rendering
	container.style.height = '800px' // Fixed height for rendering
	document.body.appendChild(container)

	return new Promise((resolve, reject) => {
		try {
			let renderCompleted = false
			const timeoutDuration = 5000

			const handleRenderComplete = async () => {
				if (renderCompleted) return
				renderCompleted = true

				console.log(
					`[pdfGenerator] ${componentName} render complete, capturing PNG...`
				)

				// Wait a bit more for any animations/layout to settle
				await new Promise((r) => setTimeout(r, 500))

				try {
					// Find the actual diagram element
					const diagramElement = container.querySelector(
						'.communication-preview-wrapper, .network-preview-wrapper'
					) as HTMLElement
					const targetElement =
						diagramElement ||
						(container.firstElementChild as HTMLElement)

					if (!targetElement) {
						throw new Error(
							`No element found to capture in ${componentName}`
						)
					}

					console.log(
						'[pdfGenerator] Capturing element:',
						targetElement
					)

					// Export as PNG
					const pngBase64 = await exportPngFromHTMLElement({
						element: targetElement,
						pixelRatio: 10,
						quality: 1
					})

					console.log(
						`[pdfGenerator] PNG captured successfully for ${componentName}`
					)

					// Cleanup
					unmount(componentInstance)
					document.body.removeChild(container)

					resolve(`data:image/png;base64,${pngBase64}`)
				} catch (error) {
					console.error(
						`[pdfGenerator] Error capturing PNG for ${componentName}:`,
						error
					)
					unmount(componentInstance)
					document.body.removeChild(container)
					reject(error)
				}
			}

			// Mount component with onRenderComplete callback
			const componentInstance = mount(component, {
				target: container,
				props: {
					...props,
					onContentChange: () => {
						// No-op during offscreen rendering for PDF
						console.log(
							'[pdfGenerator] onContentChange called during offscreen render (no-op)'
						)
					},
					onRenderComplete: handleRenderComplete
				}
			})
			console.log(
				`[pdfGenerator] ${componentName} mounted, waiting for render...`
			)

			// Fallback timeout in case onRenderComplete is never called
			setTimeout(() => {
				if (!renderCompleted) {
					console.warn(
						`[pdfGenerator] ${componentName} render timeout, capturing anyway...`
					)
					handleRenderComplete()
				}
			}, timeoutDuration)
		} catch (error) {
			console.error(
				`[pdfGenerator] Error mounting ${componentName}:`,
				error
			)
			document.body.removeChild(container)
			reject(error)
		}
	})
}
