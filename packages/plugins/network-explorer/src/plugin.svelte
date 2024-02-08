<svelte:options tag={null} />

<script lang="ts">
	import { NetworkExplorer } from "@oscd-plugins/uilib/src/lib/plugins/network-explorer";
	import * as pckg from "../package.json";
	
	// Inputs
	export let doc: XMLDocument;
	export let editCount: number
</script>

{#if doc}
<NetworkExplorer root={doc?.documentElement} { editCount } />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
