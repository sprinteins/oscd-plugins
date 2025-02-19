<script lang="ts">
	import NodeElement from "./node-element.svelte";
	import { onDestroy, onMount } from "svelte";
	import { calulateCoordinates } from "./canvas-actions.svelte";
	import { canvasStore } from "./canvas-store.svelte";
	import {
		getCirclePosition,
		getCoordinates,
		redrawConnections,
		startDrawing,
		stopDrawing,
	} from "@/headless/utils";

	onMount(() => {
		window.addEventListener("resize", redrawConnections);
	});

	onDestroy(() => {
		window.removeEventListener("resize", redrawConnections);
	});
</script>

<div
	use:calulateCoordinates
	class="grid grid-cols-3 h-screen p-2 gap-2"
	bind:this={canvasStore.container}
>
	<div
		class="flex flex-col items-center w-full gap-2 bg-gray-50"
		data-title="DO"
	>
		<div class="text-center">Data Objects</div>
		{#each canvasStore.dataObjects as node}
			<NodeElement
				{node}
				showLeftCircle={false}
				showRightCircle={true}
				{startDrawing}
				{stopDrawing}
			/>
		{/each}
	</div>
	<div
		class="flex flex-col items-center w-full gap-2 bg-gray-50"
		data-title="LC"
	>
		<div class="text-center">Logical Conditioners</div>
		{#each canvasStore.logicalConditioners as node}
			<NodeElement
				{node}
				showLeftCircle={true}
				showRightCircle={true}
				{startDrawing}
				{stopDrawing}
			/>
		{/each}
	</div>
	<div
		class="flex flex-col items-center w-full gap-2 bg-gray-50"
		data-title="LP"
	>
		<div class="text-center">Logical Physical Inputs/Outputs</div>
		{#each canvasStore.logicalPhysicals as node}
			<NodeElement
				{node}
				showLeftCircle={true}
				showRightCircle={false}
				{startDrawing}
				{stopDrawing}
			/>
		{/each}
	</div>
</div>

<svg
	class="absolute top-0 left-0 w-full h-full pointer-events-none"
	bind:this={canvasStore.svgElement}
>
	{#key canvasStore.connections}
		{#each canvasStore.connections as connection}
			<path
				class="stroke-black stroke-2 fill-none"
				d={`M ${getCoordinates(connection.from).x},${getCoordinates(connection.from).y} 
					 C ${(getCoordinates(connection.from).x + getCoordinates(connection.to).x) / 2},${getCoordinates(connection.from).y} 
					 ${(getCoordinates(connection.from).x + getCoordinates(connection.to).x) / 2},${getCoordinates(connection.to).y} 
					 ${getCoordinates(connection.to).x},${getCoordinates(connection.to).y}`}
			/>
		{/each}
	{/key}
	{#if canvasStore.drawStartPoint}
		<path
			class="stroke-black stroke-2"
			d={`M ${getCirclePosition(canvasStore.drawStartPoint).x},${getCirclePosition(canvasStore.drawStartPoint).y} L ${canvasStore.mousePosition.x},${canvasStore.mousePosition.y}`}
		/>
	{/if}
</svg>
