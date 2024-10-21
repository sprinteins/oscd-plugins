{#if $xmlDocument}
	<ContentTabs {dataTypeTemplates} />
{:else}
	<p>No xml document loaded</p>
{/if}

<script lang="ts">
	import { DataTypeTemplatesService } from "@oscd-plugins/core";
	import { xmlDocumentStore } from "../../stores";
	import ContentTabs from "./columns.svelte";
	import { get } from "svelte/store";
	
	const { xmlDocument } = xmlDocumentStore;

	const service = new DataTypeTemplatesService(get(xmlDocument).documentElement);
	const dataTypeTemplates = service.findTypeDesignerElements();
</script>