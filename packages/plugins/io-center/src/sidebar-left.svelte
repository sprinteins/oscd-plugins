
<sidebar-left>
	<IEDSelect {onSelectIED} />
		{#if store.objectTree.length > 0}
		<ObjectTree />
	{/if}
</sidebar-left>

<script lang="ts">
	import { store } from "./store.svelte";
	import IEDSelect from "./ied/ied-select.svelte";
	import type { IED } from "./ied/ied";
	import ObjectTree from "./ui/components/object-tree/object-tree.svelte";

	function onSelectIED(ied: IED) {
		store.iedSelected = ied;
	}

</script>