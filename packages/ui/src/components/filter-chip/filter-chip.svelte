<script lang="ts">
	import Button, { Label } from "@smui/button"
	// Input
	export let label: string
	export let isSelected: boolean

	export let testid = ""
	export let disabled = false

	$: dataProps = {
		"data-testid": testid,
	}
</script>

<div class="chip" class:isSelected {...dataProps}>
	<Button class="tscd-button" on:click {disabled}>
		<Label class="button-label">{label}</Label>
	</Button>
</div>

<style lang="scss">
	.chip.isSelected {
		:global(.mdc-button) {
			background-color: var(--color-filter-chips-background);
			outline: 1px var(--mdc-theme-primary) solid;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			color: var(--color-accent);
		}
	}

	.chip :global(.mdc-button .mdc-button__ripple::before) {
		background-color: unset;
	}

	.chip {
		display: inline-flex;

		:global(.mdc-button) {
			background-color: var(--color-filter-chips-background);
			color: var(--font-color);
			font-weight: 400;
			font-size: var(--font-size);
			border-radius: 12px;
			height: 0;
			padding: 0.75rem 1rem;
			box-shadow: none;
			outline: 1px var(--color-grey-3) solid;
			margin: 0.5rem;
		}
		:global(button.tscd-button:hover) {
			background-color: var(--color-filter-chips-background);
			outline: 1px var(--mdc-theme-primary) dashed;
			cursor: pointer;
		}

		// :global(.mdc-button.clicked) {
		//   border-color: black;
		// }
		// :global(.mdc-button--ripple) {
		//   background-color: black;
		// }
		:global(button.tscd-button:disabled) {
			background-color: var(--color-filter-chips-background);
			color: var(--font-color);
			font-weight: 400;
			font-size: var(--font-size);
			border-radius: 12px;
			height: 0;
			padding: 0.75rem 1rem;
			box-shadow: none;
			outline: 1px var(--color-grey-3) solid;
			margin: 0.5rem;
		}
	}
</style>
