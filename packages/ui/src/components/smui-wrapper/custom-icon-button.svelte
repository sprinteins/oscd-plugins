<IconButton size="button" style={cssDynamicStyles} on:click class={className}>
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

// props
export let icon: AvailableIcon
export let size: 'small' | 'medium' | 'large' = 'medium'
export let color: string | 'primary' | 'secondary' = 'primary'
let className = ''
export { className as class }

// local variables
const cssFixedStyles = {
	'button-size': ''
}

//====== REACTIVITY ======//

$: cssFixedStyles['button-size'] = setButtonSize(size)
$: cssDynamicStyles = setInlineStyles(cssFixedStyles)

//====== FUNCTIONS ======//

function setButtonSize(inputSize: 'small' | 'medium' | 'large') {
	if (inputSize === 'small') return '42px'
	if (inputSize === 'large') return '56px'
	return '48px'
}
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