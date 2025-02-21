<script lang="ts">
	import {store} from "../store.svelte";
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

<select
	onchange={handleChange}
	class="w-5/6 p-2.5 mt-2 mx-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
>
	<option disabled selected>Select an IED</option>
	{#each store.iedList as ied}
		<option value={ied.name} selected={ied.name === store.iedSelected?.name}
			>{ied.name}</option
		>
	{/each}
</select>
