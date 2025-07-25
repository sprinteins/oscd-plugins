type CallbackFn = () => void

export function clickOutside(node: HTMLElement, callbackFn: CallbackFn) {
	function onClick(evt: MouseEvent) {
		const target = evt.target as Node

		const isClickedOutsideNode = !node.contains(target)

		if (isClickedOutsideNode) {
			callbackFn()
		}
	}

	document.body.addEventListener('click', onClick)

	return {
		destroy() {
			document.body.removeEventListener('click', onClick)
		}
	}
}
