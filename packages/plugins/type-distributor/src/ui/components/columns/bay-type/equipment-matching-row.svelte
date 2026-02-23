<script lang="ts">
import { Label, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'

interface Props {
	equipment: {
		name: string
		type: string
	}
	options: { value: string; label: string }[]
	selectedTemplateUuid: string
	handleMatchChange: (equipmentName: string, templateUuid: string) => void
}

let { equipment, options, selectedTemplateUuid, handleMatchChange }: Props =
	$props()
</script>

<div class="space-y-2">
    <Label.Root class="text-sm font-medium">
        {equipment.name} <span class="text-gray-500">({equipment.type})</span>
    </Label.Root>
    <SelectWorkaround
        bind:value={() => selectedTemplateUuid, (v) => handleMatchChange(equipment.name, String(v ?? ''))}
        {options}
        placeholder="Select template..."
        class="w-full"
    />
</div>
