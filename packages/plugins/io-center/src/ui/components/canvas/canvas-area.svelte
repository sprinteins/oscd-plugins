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
	import AddLCDialog from "./add-lc-dialog.svelte";
	import { store } from "../../../store.svelte";
	import type {
		LcTypes,
		NodeElement as NodeElementType,
	} from "./types.canvas";

	type Props = {
		onAddLC: (type: LcTypes, number?: number) => void;
		editLC: (lcNode: NodeElementType, newType: LcTypes) => void;
		hasLNodeType: (type: LcTypes) => boolean;
	};

	const { onAddLC, editLC, hasLNodeType }: Props = $props();

	let isDialogOpen = $state(false);
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
		<div class="text-center font-mono bg-gray-300 w-full py-2">
			Data Objects
		</div>
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
		<div
			class="flex justify-center gap-2 font-mono bg-gray-300 w-full py-2 items-center"
		>
			Logical Conditioners
			<button
				class="bg-white rounded-sm p-1 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
				onclick={() => (isDialogOpen = true)}
				disabled={!store.selectedIED}
			>
				<Plus size={16} />
			</button>
		</div>
		{#each canvasStore.logicalConditioners as node}
			<NodeElement
				{node}
				showLeftCircle={true}
				showRightCircle={true}
				{startDrawing}
				{stopDrawing}
				{editLC}
				{hasLNodeType}
			/>
		{/each}
	</div>
	<div
		class="flex flex-col items-center w-full gap-2 bg-gray-50"
		data-title="LP"
	>
		<div class="text-center font-mono bg-gray-300 w-full py-2">
			Logical Physical I/O
		</div>
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

<AddLCDialog bind:isOpen={isDialogOpen} addLc={onAddLC} {hasLNodeType}/>

<svelte:window onresize={redrawConnections} />

<style>
</style>
