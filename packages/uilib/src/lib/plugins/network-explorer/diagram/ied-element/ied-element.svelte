<script lang="ts">
	import type { IEDNode } from "../nodes"

	// Input
	export let node: IEDNode
	export let isSelected = false
	export let disabled = false
	export let testid = ""

</script>

{#if node}
	<div
		class="ied"
		class:isIrrelevant={!node.isRelevant}
		class:disabled
		class:selected={isSelected}
		data-testid={testid}
	>
		{node.label}
	</div>
{/if}

<style>
	.ied {
		display: grid;
		place-items: center;
		height: 100%;
		width: 100%;
		cursor: pointer;
		padding: 0.2rem;
		transition: all 200ms ease-in-out;
		box-sizing: border-box;
		user-select: none;


		/* TODO: extract colors */
		background: var(--color-white);
		border: 1px solid var(--color-cyan);
		box-shadow: inset 0px 0px 6px rgba(77, 93, 99, 0.15);
		border-radius: 5px;
	}

	.ied:hover:not(.disabled) {
		border-style: dashed;
	}

	.ied.disabled{
		/* TODO: extract colors */
		background: rgba(252, 246, 229, 0.5);
		border: 1px solid rgba(42, 161, 152, 0.2);
		color: rgba(74, 86, 92, 0.7);
	}

	.ied.selected {
		color: var(--color-white);
		background: var(--color-cyan);
		border-width: 1px;
		border-color: var(--color-cyan);
		/* TODO: extract colors */
		box-shadow: inset 0px 0px 6px rgba(77, 93, 99, 0.15);
	}

	.ied.selected:hover{
		border-style: dashed;
		border-color: var(--color-white);

	}

	.isIrrelevant {
		opacity: 0.2;
	}
</style>
