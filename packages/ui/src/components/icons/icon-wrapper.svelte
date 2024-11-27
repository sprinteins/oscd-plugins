<svg class={className} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={fillColor}><title>icon {icon}</title><path d={draw}/></svg>

<script lang="ts">
import availableIcons from './icons-draw'
// TYPES
import type { AvailableIcon } from './types.icon'
import type { ValueOf } from '@oscd-plugins/core'

//====== INITIALIZATION ======//

// props
export let fillColor: string | 'primary' | 'secondary' = 'primary'
export let icon: AvailableIcon
let className = ''
export { className as class }

//====== REACTIVITY ======//

$: draw = getIcon(icon)
$: fillColor = setFillColor(fillColor)

//====== FUNCTIONS ======//

function getIcon(
	icon: keyof typeof availableIcons
): ValueOf<typeof availableIcons> {
	return availableIcons[icon]
}

function setFillColor(inputFillColor: string | 'primary' | 'secondary') {
	if (inputFillColor === 'primary') return 'var(--mdc-theme-primary)'
	if (inputFillColor === 'secondary') return 'var(--mdc-theme-secondary)'
	return inputFillColor
}
</script>