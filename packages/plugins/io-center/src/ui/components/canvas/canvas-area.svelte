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
	import { store } from "../../../store.svelte";
	import type {
		Connection,
		LcTypes,
		NodeElement as NodeElementType,
	} from "./types.canvas";

	type Props = {
		hasLNodeType: (type: LcTypes) => boolean;
		addConnection: (connection: Connection) => void;
	};

	const { hasLNodeType, addConnection }: Props = $props();

	async function getCurrentCoordinates(connection: Connection) {
		const fromXToY = `${(await getCoordinates(connection.from)).x},${(await getCoordinates(connection.from)).y}`;
		const fromXToXFromY = `${((await getCoordinates(connection.from)).x + (await getCoordinates(connection.to)).x) / 2},${(await getCoordinates(connection.from)).y}`;
		const fromXToXToY = `${((await getCoordinates(connection.from)).x + (await getCoordinates(connection.to)).x) / 2},${(await getCoordinates(connection.to)).y}`;
		const toXToY = `${(await getCoordinates(connection.to)).x},${(await getCoordinates(connection.to)).y}`;
		return `M ${fromXToY} C ${fromXToXFromY} ${fromXToXToY} ${toXToY}`;
	}
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
		<div class="text-center bg-gray-300 w-full py-2">
			Data Objects
		</div>
		{#each canvasStore.dataObjects as node}
			<NodeElement {node} {startDrawing} {stopDrawing} {addConnection} />
		{/each}
	</div>
	<div
		class="flex flex-col items-center w-full gap-2 bg-gray-50"
		data-title="LC"
	>
		<div
			class="flex justify-center gap-2 bg-gray-300 w-full py-2 items-center"
		>
			Logical Conditioners
		</div>
		{#each canvasStore.logicalConditioners as node}
			<NodeElement
				{node}
				leftPortsNumber={1}
				rightPortsNumber={3}
				{startDrawing}
				{stopDrawing}
				{addConnection}
				{hasLNodeType}
			/>
		{/each}
	</div>
	<div
		class="flex flex-col items-center w-full gap-2 bg-gray-50"
		data-title="LP"
	>
		<div class="text-center bg-gray-300 w-full py-2">
			Logical Physical I/O
		</div>
		{#each canvasStore.logicalPhysicals as node}
			<NodeElement
				{node}
				leftPortsNumber={2}
				{startDrawing}
				{stopDrawing}
				{addConnection}
			/>
		{/each}
	</div>
</div>

<svg
	class="absolute top-0 left-0 w-full h-full pointer-events-none"
	bind:this={canvasStore.svgElement}
>
	{#each store.connections as connection (connection.id)}
		{#await getCurrentCoordinates(connection) then d}
			<path class="stroke-black stroke-2 fill-none" {d} />
		{/await}
	{/each}
	{#if canvasStore.drawStartPoint}F
		<path
			class="stroke-black stroke-2"
			d={`M ${getCirclePosition(canvasStore.drawStartPoint).x},${getCirclePosition(canvasStore.drawStartPoint).y} L ${canvasStore.mousePosition.x},${canvasStore.mousePosition.y}`}
		/>
	{/if}
</svg>

<svelte:window onresize={redrawConnections} />

<style>
</style>
