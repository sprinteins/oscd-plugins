<script lang="ts">
  import NetworkExplorer from "@oscd-plugins/network-explorer";
  import { pluginGlobalStore } from "@oscd-plugins/core-ui-svelte";
  import { MaterialTheme } from "@oscd-plugins/ui";
</script>

{#if pluginGlobalStore.xmlDocument}
  <div class="communication-element">
    <MaterialTheme pluginType="editor">
      <NetworkExplorer doc={pluginGlobalStore.xmlDocument} editCount={1} />
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