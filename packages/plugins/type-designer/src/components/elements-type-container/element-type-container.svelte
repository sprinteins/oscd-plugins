{#if $xmlDocument}
	<ContentTabs {service} />
{:else}
	<p>No xml document loaded</p>
{/if}

<script lang="ts">
	import { DataTypeTemplatesService } from "@oscd-plugins/core";

	// STORES
	import { xmlDocumentStore } from "../../stores";
	import ContentTabs from "./columns.svelte";
	import { get } from "svelte/store";

	//stores
	const { xmlDocument } = xmlDocumentStore;

	const service = new DataTypeTemplatesService(get(xmlDocument).documentElement);
</script>