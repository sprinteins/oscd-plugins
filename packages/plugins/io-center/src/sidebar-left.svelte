<script lang="ts">
	import { store } from "./store.svelte";
	import IEDSelect from "./ied/ied-select.svelte";
	import type { IED } from "./ied/ied";
	import ObjectTree from "./ui/components/object-tree/object-tree.svelte";

	function onSelectIED(ied: IED) {
		store.selectedIED = ied;
		store.selectedDataObject = null;
		store.selectedLogicalConditioners = [];
		store.selectedLogicalPhysicals = [];
	}
</script>

<sidebar-left>
	<IEDSelect {onSelectIED} />
	{#if store.objectTree.ied.children.length > 0}
		<ObjectTree />
	{/if}
</sidebar-left>
