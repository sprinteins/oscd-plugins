<script lang="ts">
	import { IEDElement } from "../ied-element"
	import type { BayNode } from "../nodes"

	// Input
	export let node: BayNode
	export let testid = ""
</script>

{#if node}
	<div class="bay">
		<div>
			{node.label}
		</div>
		<div class="ied-container">
			{#each node.children as iedNode}
				<div class="container" style={`--width:${iedNode.width}px; --height:${iedNode.height}px;`}>
					<IEDElement node={iedNode}/>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.bay {
		width: 100%;
		height: 100%;
		padding: 0.4rem;
		border: 1px dashed var(--color-black);
		border-radius: 5px;
	}

	.ied-container {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 100%;
	}

	.container {
		width: var(--width,200px);
		height: var(--height,30px);
	}
</style>
