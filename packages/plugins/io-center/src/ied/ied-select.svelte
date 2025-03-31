<script lang="ts">
	import { store } from "../store.svelte";
	import type { IED } from "./ied";

	type Props = {
		onSelectIED: (ied: IED) => void;
	};

	let { onSelectIED }: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;

		const selectedIED = store.iedList.find(
			(ied) => ied.name === target.value,
		);

		if (selectedIED) {
			onSelectIED(selectedIED);
		}
	}
</script>

<div class="flex-col mx-auto w-full px-2 mt-2">
	<label for="select" class="font-medium">Select an IED</label>
	<select
		id="select"
		onchange={handleChange}
		class="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
	>
		<option disabled selected></option>
		{#each store.iedList as ied}
			<option
				value={ied.name}
				selected={ied.name === store.selectedIED?.name}
				>{ied.name}</option
			>
		{/each}
	</select>
</div>

<style>
	select {
		background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>") no-repeat;
		background-position: calc(100% - 0.75rem) center !important;
		-moz-appearance:none !important;
		-webkit-appearance: none !important; 
		appearance: none !important;
		padding-right: 2rem !important;
		background-color: #FAFAFA;
	}
</style>