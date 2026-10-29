/**
 * Svelte action that adds a `<style>` element as first child of the node.
 * The style lives in the same root as the node, so inside a shadow root
 * it stays scoped to it instead of leaking into the document head.
 */
export function injectStyles(node: HTMLElement, css: string) {
	let style: HTMLStyleElement | undefined

	function apply(newCss: string) {
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
