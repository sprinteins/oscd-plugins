<script lang="ts">
import { equipmentMatchingStore } from '@/headless/stores'
import { Label, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'

interface Props {
	equipment: {
		name: string
		type: string
	}
	options: { value: string; label: string }[]
	selectedTemplateUuid: string
}

let { equipment, options, selectedTemplateUuid }: Props = $props()

function handleMatchChange(value: string) {
	equipmentMatchingStore.setMatch(equipment.name, value)
}
</script>

<div class="space-y-2">
    <Label.Root class="text-sm font-medium">
        {equipment.name} <span class="text-gray-500">({equipment.type})</span>
    </Label.Root>
    <SelectWorkaround
        value={selectedTemplateUuid}
        handleChange={(e) => handleMatchChange((e.target as HTMLSelectElement)?.value ?? "")}
        {options}
        placeholder="Select template..."
        class="w-full"
    />
</div>
