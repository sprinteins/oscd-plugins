<svg class={className} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={fillColor}><title>icon {icon}</title><path d={draw}/></svg>

<script lang="ts">
	import { run } from 'svelte/legacy';

import availableIcons from './icons-draw'
// TYPES
import type { AvailableIcon } from './types.icon'
import type { Utils } from '@oscd-plugins/core'

//====== INITIALIZATION ======//


	interface Props {
		// props
		fillColor?: string | 'primary' | 'secondary';
		icon: AvailableIcon;
		class?: string;
	}

	let { fillColor = $bindable('primary'), icon, class: className = '' }: Props = $props();



//====== FUNCTIONS ======//

function getIcon(
	icon: keyof typeof availableIcons
): Utils.ValueOf<typeof availableIcons> {
	return availableIcons[icon]
}

function setFillColor(inputFillColor: string | 'primary' | 'secondary') {
	if (inputFillColor === 'primary') return 'var(--mdc-theme-primary)'
	if (inputFillColor === 'secondary') return 'var(--mdc-theme-secondary)'
	return inputFillColor
}
//====== REACTIVITY ======//

let draw = $derived(getIcon(icon))
run(() => {
		fillColor = setFillColor(fillColor)
	});
</script>