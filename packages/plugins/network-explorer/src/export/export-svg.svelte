<script lang="ts">
  import { toSvg } from 'html-to-image';
  import {
    Panel,
    getNodesBounds,
    getViewportForBounds,
    useNodes,
  } from '@xyflow/svelte';
  import Button from '@oscd-plugins/ui/src/components/button/button.svelte';

  const nodes = useNodes();

  export let flowPane: HTMLElement | null = null;
  export let imageHeight: number = 768;
  export let imageWidth: number = 1024;
  export let backgroundColor: string = 'var(--global-background-color)';
  export let fileName: string = 'svelte-flow.svg';

  if (!flowPane) {
    console.warn('Flow pane reference not provided to export component')
  }

  async function handleClick() {
    if (!flowPane) {
      console.error('Flow pane reference not available');
      return;
    }

    const nodesBounds = getNodesBounds(nodes.current);
    console.log('Nodes bounds:', nodesBounds);
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2.0,
      0.2,
    );

    if (!viewport) {
      console.error('Could not determine viewport for nodes bounds');
      return;
    }

    try {
      const dataUrl = await toSvg(flowPane, {
        backgroundColor: backgroundColor,
        width: imageWidth,
        height: imageHeight,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('toSvg failed', err);
    }
  }
</script>

<Button onclick={handleClick}>Download SVG</Button>
