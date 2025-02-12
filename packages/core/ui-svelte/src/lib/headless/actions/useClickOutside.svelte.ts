// TYPES
import type { Action } from 'svelte/action'

/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement): ReturnType<
	Action<
		HTMLElement,
		undefined,
		{
			onclickoutside: (e: CustomEvent) => void
		}
	>
> {
	function handleClickOutside(event: Event) {
		if (
			node &&
			!node.contains(event.target as HTMLElement) &&
			!event.defaultPrevented
		) {
			node.dispatchEvent(
				new CustomEvent('clickoutside', { detail: node })
			)
		}
	}

	$effect(() => {
		document.addEventListener('click', handleClickOutside, true)

		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	})
}
