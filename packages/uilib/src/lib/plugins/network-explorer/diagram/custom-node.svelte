<script lang="ts">
	/**
	 * This component is not in used
	 * It serves as an example for a custom node
	 * with variable number of handles
	 */
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  
	type $$Props = NodeProps;
  
	export let isConnectable: $$Props['isConnectable'];
  
	const DEFAULT_HANDLE_STYLE = 'width: 10px; height: 10px; bottom: -5px;';
  
	const colors = ['red', 'blue', 'orange', "green", "pink","black", "purple"]
  
	const nrOfHandle = colors.length
	const padding = 5
	const width = 100-(2*padding)
	const gap = width/ (nrOfHandle-1)
  
	function pos(i: number){
	  return padding+(i*gap)
	}
  
  </script>
  
  <div style="background: #DDD; padding: 25px">
	<div>Node</div>
  
  {#each colors as color, i}
  <Handle
	  id={color}
	  type="source"
	  position={Position.Bottom}
	  style={`${DEFAULT_HANDLE_STYLE}; left: ${pos(i)}%; background: ${color};`}
	  {isConnectable}
	/>
  {/each}
  
  </div>
  