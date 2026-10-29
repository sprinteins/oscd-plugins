/**
 * Svelte action that adds a `<style>` element as first child of the node.
 * The style lives in the same root as the node, so inside a shadow root
 * it stays scoped to it instead of leaking into the document head.
 */
export function injectStyles(node: HTMLElement, css: string) {
	const style = document.createElement('style')
	style.textContent = css
	node.prepend(style)

	return {
		update(newCss: string) {
			style.textContent = newCss
		},
		destroy() {
			style.remove()
		}
	}
}
