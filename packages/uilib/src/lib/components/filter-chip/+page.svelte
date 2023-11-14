<script lang="ts">
	import { Example } from "../internal"
	import type { ButtonGroupOption } from "../button-group"
	import FilterChip from "./filter-chip.svelte"
	
	let clicked = false
	function handleClick() {
		console.log({level: "demo", msg: "clicked"})
		clicked = true
	}
	
	const options = [
		{ label: "Publishers" },
		{ label: "Subscribers" },
	]

	let disabled = false
</script>

<h1>Chips</h1>

<Example name="Primary">
	{#each options as option}
		<FilterChip
			label={option.label}
			isSelected={false}
			{disabled}
			on:click={handleClick}
			testid="button-primary"
		/>
	{/each}
</Example>
