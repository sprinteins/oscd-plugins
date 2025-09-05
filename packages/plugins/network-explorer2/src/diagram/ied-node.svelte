<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  
	type $$Props = NodeProps;
	
	export let data: $$Props['data'];
	export let isConnectable: $$Props['isConnectable'];
	export let selected: $$Props['selected'];
	// export let dragging: $$Props['dragging'];

  
	const { label } = data;
	// $: console.log({level:"dev", data, props: $$props })
  </script>
  
  <Handle
	type="target"
	position={Position.Left}
	{isConnectable}
	on:connect
	on:connectend
	on:connectstart
  />
	<div
		class="ied"
		class:selected
	>
  		{label}
	</div>
  <Handle
	type="source"
	position={Position.Right}
	id="a"
	{isConnectable}
	on:connect
	on:connectend
	on:connectstart
  />
  <!-- <Handle
	type="source"
	position={Position.Right}
	id="b"
	style="bottom: 10px; top: auto; background: #555;"
	{isConnectable}
	on:connect
	on:connectend
	on:connectstart
  /> -->
  
  <style>
	:global(.svelte-flow__node-selectorNode) {
	  font-size: 12px;
	  background: #eee;
	  border: 1px solid #555;
	  border-radius: 5px;
	  text-align: center;
	}

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