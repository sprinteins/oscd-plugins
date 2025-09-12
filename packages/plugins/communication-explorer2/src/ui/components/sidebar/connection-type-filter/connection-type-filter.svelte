<script lang="ts">
	import { changeMessageConnectionFilterDirection } from '../../../../headless/index.js'
	export let disabled = false
	export let isFilterIncomingActive = false
	export let isFilterOutgoingActive = false

	function handleClickOnPublisher() {
		changeMessageConnectionFilterDirection(
			!isFilterIncomingActive,
			isFilterOutgoingActive
		)
	}

	function handleClickOnSubscriber() {
		changeMessageConnectionFilterDirection(
			isFilterIncomingActive,
			!isFilterOutgoingActive
		)
	}
</script>

<div class="ButtonGroup">
	<button
		class="chip"
		class:selected={isFilterIncomingActive}
		{disabled}
		on:click={handleClickOnPublisher}
	>
		Published
	</button>
	<button
		class="chip"
		class:selected={isFilterOutgoingActive}
		{disabled}
		on:click={handleClickOnSubscriber}
	>
		Subscribed
	</button>
</div>

<style>
	.ButtonGroup {
		border-radius: 1rem;
		display: flex;
	}
	
	.chip {
		border: 1px solid #ccc;
		background: white;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.9rem;
	}
	
	.chip:first-of-type {
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
		margin-left: 0;
	}
	
	.chip:last-of-type {
		border-top-right-radius: 1rem;
		border-bottom-right-radius: 1rem;
		margin-right: 0;
		border-left: none;
	}
	
	.chip.selected {
		background: var(--color-accent, #0066cc);
		color: white;
		border-color: var(--color-accent, #0066cc);
	}
	
	.chip:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>