	
<script lang="ts">
// COMPONENTS
import { Label, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore } from '@/headless/stores'
import { setConductingEquipmentTerminalCount } from '@/headless/stores/type-elements/terminal-crud-operation.helper'

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
	const equipmentElement = sidebarStore.currentElementType?.element
	if (!equipmentElement) return

	setConductingEquipmentTerminalCount({
		equipmentElement,
		value
	})

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
