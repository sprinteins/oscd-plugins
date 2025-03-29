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
		Connection,
		LcTypes,
		NodeElement as NodeElementType,
	} from "./types.canvas";
    import { onDestroy } from "svelte";

	type Props = {
		addLC: (type: LcTypes, number?: number, numberOfLCIVPorts?: number) => void;
		editLC: (lcNode: NodeElementType, newType: LcTypes) => void;
		hasLNodeType: (type: LcTypes) => boolean;
		addConnection: (connection: Connection) => void;
		removeConnection: (connection: Connection) => void;
	};

	const { addLC, editLC, hasLNodeType, addConnection, removeConnection }: Props = $props();

	let isDialogOpen = $state(false);

	let selectedConnection: Connection | null = $state(null);

	async function getCurrentCoordinates(connection: Connection) {
		const fromXToY = `${(await getCoordinates(connection.from)).x},${(await getCoordinates(connection.from)).y}`;
		const fromXToXFromY = `${((await getCoordinates(connection.from)).x + (await getCoordinates(connection.to)).x) / 2},${(await getCoordinates(connection.from)).y}`;
		const fromXToXToY = `${((await getCoordinates(connection.from)).x + (await getCoordinates(connection.to)).x) / 2},${(await getCoordinates(connection.to)).y}`;
		const toXToY = `${(await getCoordinates(connection.to)).x},${(await getCoordinates(connection.to)).y}`;
		return `M ${fromXToY} C ${fromXToXFromY} ${fromXToXToY} ${toXToY}`;
	}

	async function setSelectedConnection(connection: Connection, evt: MouseEvent) {
		evt.stopPropagation();
		selectedConnection = connection;
	}


	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Backspace" && selectedConnection) {

			console.log("About to delete connection: ", selectedConnection)

			removeConnection(selectedConnection);
			selectedConnection = null;
		}
	}

	window.addEventListener("keydown", handleKeyPress);

	onDestroy(() => {
		window.removeEventListener("keydown", handleKeyPress);
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
		<div class="text-center font-mono bg-gray-300 w-full py-2">
			Data Objects
		</div>
		{#each canvasStore.dataObjects as node}
			<NodeElement
				{node}
				{startDrawing}
				{stopDrawing}
				{addConnection}
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
				leftPortsNumber={1}
				rightPortsNumber={3}
				{startDrawing}
				{stopDrawing}
				{addConnection}
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
				leftPortsNumber={2}
				{startDrawing}
				{stopDrawing}
				{addConnection}
			/>
		{/each}
	</div>
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	class="absolute top-0 left-0 w-full h-full pointer-events-none"
	bind:this={canvasStore.svgElement}
	onclick={()=>{selectedConnection = null}}
>
	{#each store.connections as connection (connection.id)}
		{#await getCurrentCoordinates(connection) then d}
			<path class={`
				stroke-2 fill-none cursor-pointer pointer-events-auto
				${selectedConnection === connection.id ? "stroke-red-500" : "stroke-black"}
			`} 
				{d} 
				onclick={(event) => setSelectedConnection(connection, event)}
			/>
		{/await}
	{/each}
	{#if canvasStore.drawStartPoint}F
		<path
			class="stroke-black stroke-2"
			d={`M ${getCirclePosition(canvasStore.drawStartPoint).x},${getCirclePosition(canvasStore.drawStartPoint).y} L ${canvasStore.mousePosition.x},${canvasStore.mousePosition.y}`}
		/>
	{/if}
</svg>

<AddLCDialog bind:isOpen={isDialogOpen} {addLC} {hasLNodeType} />

<svelte:window onresize={redrawConnections} />

<style>
</style>
