<script lang="ts">
	import type { IEDElkNode } from "../nodes"

	// 
	// INPUT
	// 
	export let node: IEDElkNode
	export let isIEDSelected = false
	export let isBaySelected = false
	export let disabled = false
	export let testid = ""

	let bays = Array.from(node.bayLabels).join(", ");
</script>

{#if node}
<!--
	{#if bays.length > 0}
		<div 
			class="bayLabel selectable"
			class:isIrrelevant={!node.isRelevant}
			class:disabled
			class:selected={isBaySelected}
			style="height: {node.bayLabelHeight}px;margin-bottom: {node.bayLabelGap}px"
		>
			{#each bays as bay}
				{bay}
			{/each}
		</div>
	{/if}
-->
	
	<div
		class="ied selectable"
		class:isIrrelevant={!node.isRelevant}
		class:disabled
		class:selected={isIEDSelected}
		data-testid={testid}
		style="height: {node.iedHeight}px"
	>
		{node.label}
	</div>
{/if}

<style>
	.selectable {
		cursor: pointer;
		transition: all 200ms ease-in-out;
		user-select: none;
		padding: 0.2em;

		/* TODO: extract colors */
		background: var(--color-white);
		border: 1px solid var(--color-cyan);
		box-shadow: inset 0px 0px 6px rgba(77, 93, 99, 0.15);
		border-radius: 5px;
		box-sizing: border-box;
	}

	.selectable:hover:not(.disabled) {
		border-style: dashed;
	}

	.selectable.disabled{
		/* TODO: extract colors */
		background: rgba(252, 246, 229, 0.5);
		border: 1px solid rgba(42, 161, 152, 0.2);
		color: rgba(74, 86, 92, 0.7);
	}

	.selectable.selected {
		color: var(--color-white);
		background: var(--color-cyan);
		border-width: 1px;
		border-color: var(--color-cyan);
		/* TODO: extract colors */
	}
	
	.selectable.selected:hover{
		border-style: dashed;
		border-color: var(--color-white);
	}

	.ied {
		display: grid;
		place-items: center;
		width: 100%;
	}

	.bayLabel {
		width: fit-content;
		font-size: 10px;
		padding-left: 4px;
		padding-right: 4px;
	}

	.isIrrelevant {
		opacity: 0.2;
	}
</style>
