<script lang="ts">
  import { onMount } from 'svelte';
  import { toPng } from 'html-to-image';
  import {
    Panel,
    getNodesBounds,
    getViewportForBounds,
    useNodes,
  } from '@xyflow/svelte';
  import Button from '@oscd-plugins/ui/src/components/button/button.svelte';

  const nodes = useNodes();
  const imageWidth = 1024;
  const imageHeight = 768;

  export let flowPane: HTMLElement | null = null;

  if (!flowPane) {
    console.warn('Flow pane reference not provided to export component')
  }

  async function handleClick() {
    if (!flowPane) {
      console.error('Flow pane reference not available');
      return;
    }

    const nodesBounds = getNodesBounds(nodes.current);
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
      const dataUrl = await toPng(flowPane, {
        backgroundColor: '#1a365d',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = 'svelte-flow.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('toPng failed', err);
    }
  }
</script>

<Panel position="top-right">
  <Button onclick={handleClick}>Download Image</Button>
</Panel>