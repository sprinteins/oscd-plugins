export function injectDiagramStyles(node: HTMLElement, css: string) {
	let style: HTMLStyleElement | undefined

	function apply(newCss: string): void {
		if (!newCss) {
			style?.remove()
			style = undefined
			return
		}

		if (!style) {
			style = document.createElement('style')
			node.prepend(style)
		}

		style.textContent = newCss
	}

	apply(css)

	return {
		update: apply,
		destroy() {
			style?.remove()
		}
	}
}
