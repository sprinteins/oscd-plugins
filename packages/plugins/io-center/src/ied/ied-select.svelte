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
