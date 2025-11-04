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

  let possibleShadowElement: HTMLElement;
  let root: Document | ShadowRoot;

  onMount(() => {
    root = possibleShadowElement.getRootNode() as Document | ShadowRoot;
  });

  function getPaneInRoot(): HTMLElement | null {
    if (!root) return null;
    const pane = root.querySelector<HTMLElement>('.svelte-flow__pane');
    return pane ?? null;
  }

  async function handleClick() {
    const viewportDomNode = getPaneInRoot();

    if (!viewportDomNode) {
      console.error(
        'Could not find .svelte-flow__pane. If the component uses a closed ShadowRoot, it cannot be accessed.'
      );
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
      const dataUrl = await toPng(viewportDomNode, {
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
  <div bind:this={possibleShadowElement}></div>
  <Button onclick={handleClick}>Download Image</Button>
</Panel>