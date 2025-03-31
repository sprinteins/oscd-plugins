	
<script lang="ts">
import { v4 as uuidv4 } from 'uuid'
// COMPONENTS
import {
	Label,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore } from '@/headless/stores'
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'

//====== FUNCTIONS ======//

const isCurrentSelectDisabled = $derived(
	sidebarStore.isCurrentElementImported ||
		(!!sidebarStore.currentElementType?.parameters.childrenOptions
			.conductingEquipment?.currentValue &&
			sidebarStore.currentElementType?.parameters.childrenOptions
				.conductingEquipment?.options.length <= 1)
)

//====== GETTERS / SETTERS ======//

function getTerminalValue() {
	return (
		sidebarStore.currentElementType?.parameters.childrenOptions
			?.conductingEquipment?.currentValue || 0
	)
}

async function setTerminalValue(value: number) {
	if (!sidebarStore.currentElementType) return

	if (!pluginGlobalStore.host) throw new Error('Host not found')

	const currentTerminalsElements =
		sidebarStore.currentElementType.parameters.childrenOptions
			.conductingEquipment?.currentTerminalsElements

	if (value === 1 && currentTerminalsElements?.length === 2)
		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				node: currentTerminalsElements[1]
			}
		})
	if (value === 2 && currentTerminalsElements?.length === 1) {
		const clonedTerminal = currentTerminalsElements[0].cloneNode(
			false
		) as Element
		clonedTerminal.setAttribute('uuid', uuidv4())

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				parent: sidebarStore.currentElementType.element,
				node: clonedTerminal,
				reference: null
			}
		})
	}

	await sidebarStore.refreshCurrentElementType()
}
</script>


{#if sidebarStore.currentElementType?.parameters.childrenOptions.conductingEquipment}
	<div class="flex justify-between items-center">
		<Label.Root class="w-4/5">Number of Terminals:</Label.Root>
		<SelectWorkaround
			class="w-2/6"
			disabled={isCurrentSelectDisabled}
			options={sidebarStore.currentElementType.parameters.childrenOptions.conductingEquipment.options}
			bind:value={
				getTerminalValue,
				setTerminalValue
			}
		/>
	</div>
{/if}
