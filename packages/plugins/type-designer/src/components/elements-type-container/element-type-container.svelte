{#if $xmlDocument}
	<ToolBar />
{:else}
	<p>No xml document loaded</p>
{/if}

<script lang="ts">
// COMPONENTS
import ToolBar from './tool-bar.svelte'
// STORES
import { xmlDocumentStore } from '../../stores'

//stores
const { xmlDocument } = xmlDocumentStore
</script>


