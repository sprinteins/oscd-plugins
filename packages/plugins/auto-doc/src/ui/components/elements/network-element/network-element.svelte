<script lang="ts">
  import NetworkExplorer from "@oscd-plugins/network-explorer/src/network-explorer.svelte";
  import { pluginGlobalStore } from "@oscd-plugins/core-ui-svelte";
  import { MaterialTheme } from "@oscd-plugins/ui";
  import NoXmlWarnign from "../../no-xml-warning/no-xml-warnign.svelte";
</script>

{#if pluginGlobalStore.xmlDocument}
  <div class="communication-element">
    <MaterialTheme pluginType="editor">
      <NetworkExplorer doc={pluginGlobalStore.xmlDocument} environment="AUTO_DOC" />
    </MaterialTheme>
  </div>
{:else}
  <NoXmlWarnign />
{/if}