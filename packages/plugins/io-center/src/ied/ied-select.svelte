<script lang="ts">
	import store from "../store.svelte";
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

<p>IEDs:</p>
<select onchange={handleChange}>
	{#each store.iedList as ied}
		<option value={ied.name}>{ied.name}</option>
	{/each}
</select>
