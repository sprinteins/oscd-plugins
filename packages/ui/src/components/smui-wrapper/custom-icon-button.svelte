<IconButton size="button" style={cssDynamicStyles} on:click >
	<IconWrapper icon={icon} fillColor={iconColor} isCustomIconButton={true}/>
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

// local variables
const cssFixedStyles = {
	'button-size': ''
}

//====== REACTIVITY ======//

$: iconColor = setColor(color)
$: cssFixedStyles['button-size'] = setButtonSize(size)
// dynamic inline styles
$: cssDynamicStyles = setInlineStyles(cssFixedStyles)

//====== FUNCTIONS ======//

function setColor(inputColor: string | 'primary' | 'secondary') {
	if (inputColor === 'primary') return 'var(--mdc-theme-primary)'
	if (inputColor === 'secondary') return 'var(--mdc-theme-secondary)'
	return inputColor
}

function setButtonSize(inputSize: 'small' | 'medium' | 'large') {
	if (inputSize === 'small') return '42px'
	if (inputSize === 'large') return '56px'
	return '48px'
}
</script>

<style>
	:global(.mdc-icon-button.smui-icon-button--size-button, .mdc-icon-button.smui-icon-button--size-button svg){
		width: var(--button-size)!important;
		height: var(--button-size)!important;
	}
</style>