{#if $xmlDocument}
	<ToolBar />
	<ContentTabs />
{:else}
	<p>No xml document loaded</p>
{/if}

<script lang="ts">
// COMPONENTS
import ToolBar from './tool-bar.svelte'
// STORES
import { xmlDocumentStore } from '../../stores'
import ContentTabs from "./content-tabs.svelte"

//stores
const { xmlDocument } = xmlDocumentStore
</script>
