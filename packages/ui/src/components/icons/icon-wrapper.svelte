<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={fillColor}><title>icon</title><path d={draw}/></svg>

<script lang="ts">
import availableIcons from './icons-draw'
// TYPES
import type { ValueOf } from '@oscd-plugins/core'

//====== INITIALIZATION ======//

// props
export let fillColor = 'white'
export let icon: keyof typeof availableIcons

let draw: ValueOf<typeof availableIcons>

//====== REACTIVITY ======//

$: draw = getIcon(icon)

//====== FUNCTIONS ======//

function getIcon(icon: keyof typeof availableIcons) {
	return availableIcons[icon]
}
</script>