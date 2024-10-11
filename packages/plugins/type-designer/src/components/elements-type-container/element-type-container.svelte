{#if $xmlDocument}
	<ContentTabs {scdQueries} />
{:else}
	<p>No xml document loaded</p>
{/if}

<script lang="ts">
	import { DataTypeTemplatesQueries } from "@oscd-plugins/core";

	// STORES
	import { xmlDocumentStore } from "../../stores";
	import ContentTabs from "./content-tabs.svelte";
	import { get } from "svelte/store";

	//stores
	const { xmlDocument } = xmlDocumentStore;

	const scdQueries = new DataTypeTemplatesQueries(
		get(xmlDocument).documentElement,
	);
</script>