<svg style={cssDynamicStyles} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={fillColor}><title>icon {icon}</title><path d={draw}/></svg>

<script lang="ts">
import availableIcons from './icons-draw'
// UTILS
import { setInlineStyles } from '../../utils'
// TYPES
import type { AvailableIcon } from './types.icon'
import type { ValueOf } from '@oscd-plugins/core'

//====== INITIALIZATION ======//

// props
export let fillColor = 'white'
export let icon: AvailableIcon
export let isCustomIconButton = false

// local variables
const cssFixedStyles = {
	'svg-padding': ''
}

//====== REACTIVITY ======//

$: draw = getIcon(icon)
$: cssFixedStyles['svg-padding'] = setPadding(isCustomIconButton)
// dynamic inline styles
$: cssDynamicStyles = setInlineStyles(cssFixedStyles)

//====== FUNCTIONS ======//

function getIcon(
	icon: keyof typeof availableIcons
): ValueOf<typeof availableIcons> {
	return availableIcons[icon]
}

function setPadding(isCustomIconButton: boolean) {
	if (isCustomIconButton) return '6px'
	return '0px'
}
</script>

<style>
	/* This is used for the SMUI IconButton on hover issue, solved by the Custom Icon Button component */
	svg {
		padding: var(--svg-padding);
	}
</style>