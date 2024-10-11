{#if $xmlDocument}
	<ContentTabs />
{:else}
	<p>No xml document loaded</p>
{/if}

<script lang="ts">
// STORES
import { xmlDocumentStore } from '../../stores'
import ContentTabs from "./content-tabs.svelte"

//stores
const { xmlDocument } = xmlDocumentStore
</script>
