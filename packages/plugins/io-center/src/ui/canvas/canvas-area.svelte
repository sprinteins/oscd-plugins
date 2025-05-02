<script lang="ts">
// STORES
import { canvasStore } from '@/headless/stores'
// COMPONENTS
import Columns from './columns.svelte'
</script>

<svelte:window onresize={() => canvasStore.setWindowSize({ width: window.innerWidth, height: window.innerHeight })} />


<Columns />

<svg
	class="absolute top-0 left-0 w-full h-full pointer-events-none"
	bind:this={canvasStore.svgElement}
> 
		{#each canvasStore.connectionsCoordinates as connection (`${connection.source}-${connection.target}`)}
			<path
				class="stroke-primary stroke-[3] fill-none focus:stroke-destructive focus:outline-none cursor-pointer pointer-events-auto"
				d={connection.svgDPath}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Delete' && canvasStore.deleteConnection({ source: connection.source, target: connection.target })}
			/>
		{/each}

	{#if canvasStore.currentSvgDPath}
		<path
			class="stroke-black stroke-[3]"
			stroke-dasharray="5,5"
			d={canvasStore.currentSvgDPath}
		/>
	{/if}
</svg>