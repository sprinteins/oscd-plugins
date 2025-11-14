<script lang="ts">
  import NetworkExplorer from "@oscd-plugins/network-explorer/src/network-explorer.svelte";
  import { pluginGlobalStore } from "@oscd-plugins/core-ui-svelte";
  import { MaterialTheme } from "@oscd-plugins/ui";
  import NoXmlWarnign from "../../no-xml-warning/no-xml-warnign.svelte";
  import { exportPngFromHTMLElement } from "@/utils/diagram-export";
  import type { ImageData } from '../image-element/types.image';
  import Select from "@oscd-plugins/ui/src/components/select/select.svelte";

  const SVELTE_FLOW__PANE = '.svelte-flow__pane';
  const DELAY_BEFORE_FLOW_PANE = 2000;

  interface Props {
    content?: string
    onContentChange: (newContent: string) => void
  }

  let { content = '', onContentChange }: Props = $props()

  let htmlRoot: HTMLElement | null = $state(null)
	let flowPane: HTMLElement | null = $state(null)

  const exportNetworkDiagram = async () => {
    if (!flowPane) {
      console.error("Flow pane is not available for export.");
      return;
    }
    try {
      const pngBase64 = await exportPngFromHTMLElement({ element: flowPane});
      const fullDataUri = `data:image/png;base64,${pngBase64}`;
     
      const data: ImageData = {
        scale: "Large",
        base64Data: fullDataUri
		  }

      onContentChange(JSON.stringify(data));
    } catch (error) {
      console.error("Error exporting diagram as PNG:", error);
    }
  };

  const waitForDiagramToRender = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, DELAY_BEFORE_FLOW_PANE));
  };

  $effect(() => {
		if (htmlRoot) {
			const pane = htmlRoot.querySelector<HTMLElement>(SVELTE_FLOW__PANE)
			if (pane) {
				flowPane = pane
        waitForDiagramToRender().then(() => {
          exportNetworkDiagram();
        });
			}
		}
	})
</script>

{#if pluginGlobalStore.xmlDocument}
  <div class="communication-element" bind:this={htmlRoot}>
    <h3>Network Overview</h3>
    <sub>Choose the bays you want to display in the diagram</sub>
    
    <h4>Preview</h4>
    <MaterialTheme pluginType="editor">
      <NetworkExplorer doc={pluginGlobalStore.xmlDocument} environment="AUTO_DOC" />
    </MaterialTheme>
  </div>
{:else}
  <NoXmlWarnign />
{/if}