<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  
	type $$Props = NodeProps;
	
	interface Props {
		data: $$Props['data'];
	}

	let { data }: Props = $props();
  
	const { label } = data;
	// $: console.log({level:"dev", data, props: $$props })
  </script>
  
<div class="bay">
	{label}
</div>

  
  <style>
	:global(.svelte-flow__node-selectorNode) {
	  font-size: 12px;
	  background: #eee;
	  border: 1px solid #555;
	  border-radius: 5px;
	  text-align: center;
	}

	.bay {
		display: grid;
		place-items: baseline;
		height: 100%;
		width: 100%;
		cursor: pointer;
		padding: 0.2rem;
		transition: all 200ms ease-in-out;
		box-sizing: border-box;
		user-select: none;


		/* TODO: extract colors */
		/* background: var(--color-white); */
		background: #f9f7f18a;
		border: 1px solid var(--color-cyan);
		box-shadow: inset 0px 0px 6px rgba(77, 93, 99, 0.15);
		border-radius: 5px;
	}

	.bay:hover:not(.disabled) {
		border-style: dashed;
	}

	.bay.disabled{
		/* TODO: extract colors */
		background: rgba(252, 246, 229, 0.5);
		border: 1px solid rgba(42, 161, 152, 0.2);
		color: rgba(74, 86, 92, 0.7);
	}

	.bay.selected {
		color: var(--color-white);
		background: var(--color-cyan);
		border-width: 1px;
		border-color: var(--color-cyan);
		/* TODO: extract colors */
		box-shadow: inset 0px 0px 6px rgba(77, 93, 99, 0.15);
	}

	.bay.selected:hover{
		border-style: dashed;
		border-color: var(--color-white);

	}

	.isIrrelevant {
		opacity: 0.2;
	}
  </style>