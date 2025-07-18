<IconButton size="button" style={cssDynamicStyles} { onclick } class={className}>
	<IconWrapper icon={icon} fillColor={color} class="custom-icon-button-wrapper"/>
</IconButton>

<script lang='ts'>
import IconButton from '@smui/icon-button'
// COMPONENTS
import { IconWrapper } from '../icons'
// UTILS
import { setInlineStyles } from '../../utils'
// TYPES
import type { AvailableIcon } from '../icons/types.icon'

//====== INITIALIZATION ======//

let {
	icon,
	size,
	color,
	class: className = '',
	onclick
} = $props();

//====== REACTIVITY ======//

const cssFixedStyles = $derived.by(() => {
	let buttonSize = '48px'

	if (size === 'small') buttonSize = '42px'
	if (size === 'large') buttonSize = '56px'

	return { 'button-size': buttonSize }
});

const cssDynamicStyles = $derived(setInlineStyles(cssFixedStyles))

</script>

<style>
	:global(svg.custom-icon-button-wrapper) {
		padding: .25rem;
	}

	:global(.mdc-icon-button.smui-icon-button--size-button, .mdc-icon-button.smui-icon-button--size-button svg){
		width: var(--button-size)!important;
		height: var(--button-size)!important;
	}
</style>