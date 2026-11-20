<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'

interface Props {
	selected: string[]
	testid: string
	labels: string[]
}

let { selected = $bindable(), testid, labels }: Props = $props()

function dataTestid(id: string) {
	return { 'data-testid': id }
}

function chipTestid(rootTestId: string, label: string) {
	return `${rootTestId}_${label}`
}

function isSelected(label: string) {
	return selected.includes(label)
}

function toggle(label: string) {
	selected = isSelected(label)
		? selected.filter((selectedLabel) => selectedLabel !== label)
		: [...selected, label]
}
</script>

<div class="flex flex-wrap gap-1">
	{#each labels as label}
		<Button.Root
			variant={isSelected(label) ? 'secondary' : 'outline'}
			size="sm"
			aria-pressed={isSelected(label)}
			onclick={() => toggle(label)}
			{...dataTestid(chipTestid(testid, label))}
		>
			{label}
		</Button.Root>
	{/each}
</div>
