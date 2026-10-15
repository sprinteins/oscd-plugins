type ClickHandler = (event: MouseEvent) => void

export function forwardClick(node: HTMLElement, clickHandler?: ClickHandler) {
	const handleClick = (event: MouseEvent) => clickHandler?.(event)
	node.addEventListener('click', handleClick)

	return {
		update(nextClickHandler?: ClickHandler) {
			clickHandler = nextClickHandler
		},
		destroy() {
			node.removeEventListener('click', handleClick)
		}
	}
}
