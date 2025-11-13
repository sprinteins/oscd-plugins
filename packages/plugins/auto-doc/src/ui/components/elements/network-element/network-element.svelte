<script lang="ts">
  import NetworkExplorer from "@oscd-plugins/network-explorer/src/network-explorer.svelte";
  import { pluginGlobalStore } from "@oscd-plugins/core-ui-svelte";
  import { MaterialTheme } from "@oscd-plugins/ui";

  type NetworkElementProps = {
    doc: XMLDocument;
    editCount: number;
  };

  let { doc, editCount }: NetworkElementProps = $props()

</script>

{#if pluginGlobalStore.xmlDocument}
    <div class="communication-element">
      <MaterialTheme pluginType="editor">
        <NetworkExplorer { doc } { editCount } />
    	</MaterialTheme>
    </div>
{:else}
    <div class="no-xml-warning">
        <p>No XML document loaded. Please load an XML document to use this component.</p>
    </div>
{/if}

<style>
    .no-xml-warning {
        color: red;
        font-weight: bold;
    }
</style>