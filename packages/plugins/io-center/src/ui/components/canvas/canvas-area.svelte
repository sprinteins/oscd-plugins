
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
		<div class="text-center">
			Logical Conditioners
			<button
				class="flex items-center justify-center rounded-lg py-2 gap-2 w-full bg-gray-200 mb-2 border border-gray-400"
				onclick={onAddLCClick}
			>
				<Plus size={16} />
				<p>Add Logical Conditioner</p>
    		</button>
		</div>
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


{#if isDialogOpen}
<AddLCDialog
	open 
	onAdd={(newLC) => {
		onAddLC(newLC.type, newLC.instance, newLC.nrOfLRTIInputs);
		isDialogOpen = false;
	}}
	onCancel={() => isDialogOpen = false}
/>
{/if}

<style>
	
</style>
  


<script lang="ts">
	import NodeElement from "./node-element.svelte";
	import { calulateCoordinates } from "./canvas-actions.svelte";
	import { canvasStore } from "./canvas-store.svelte";
	import {
		getCirclePosition,
		getCoordinates,
		redrawConnections,
		startDrawing,
		stopDrawing,
	} from "@/headless/utils";
	import { Plus } from "lucide-svelte";
	import AddLCDialog from "./add-lc-dialog/add-lc-dialog.svelte";
    import type { LCType } from "./add-lc-dialog/add-lc-dialog.types";

	type Props = {
		onAddLC: (lcType: LCType, instance: string, nrOfLRTIInputs?: number) => void;
	}

	const { onAddLC }: Props = $props();

	let isDialogOpen = $state(true); //TODO: should be false
	
	function onAddLCClick() {
		isDialogOpen = true;
	}
	



</script>

<svelte:window onresize={redrawConnections} />
