<script lang="ts">
	import { IEDElement } from "../ied-element"
	import type { BayElkNode } from "@oscd-plugins/ui"

	// Input
	export let node: BayElkNode
	export let testid = ""
</script>

{#if node}
	<div class="bay" data-testid={testid}>
		<div>
			{node.label}
		</div>
		{#each node.children as child}
			<IEDElement
				node={child}
				isIEDSelected={false}
				testid={`ied-${node.label}`}
			/>
		{/each}
	</div>
{/if}

<style>
	.bay {
		width: 100%;
		height: 100%;
		padding: 0.4rem;
		border: 2px dashed var(--color-black);
		border-radius: 5px;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>