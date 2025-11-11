<script lang="ts">
  import { elementToSVG } from 'dom-to-svg';
  import Button from '@oscd-plugins/ui/src/components/button/button.svelte';

  export let flowPane: HTMLElement | null = null;
  export let imageHeight: number = 768;
  export let imageWidth: number = 1024;
  export let backgroundColor: string = '#ffffff';
  export let fileName: string = 'network-diagram.svg';

  async function exportFlowToSVG(width: number, height: number) {
    if (!flowPane) throw new Error(`No pane provided`);

    const iframe = document.createElement("iframe");
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.position = "absolute";
    iframe.style.top = "150%";
    iframe.style.left = "150%";
    document.body.append(iframe);

    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) throw new Error("Could not get iframe document");

    const iframeStyle = iframeDocument.createElement("style");
    iframeStyle.innerHTML = `
      body {
        margin: 0;
        padding: 0;
        background-color: ${backgroundColor};
      }
    `;
    iframeDocument.body.append(iframeStyle);
    const clone = flowPane.cloneNode(true) as HTMLElement;
    clone.style.transform = "none";
    iframeDocument.body.append(clone);

    const svgDocument = elementToSVG(iframeDocument.documentElement);
    const svgString = new XMLSerializer().serializeToString(svgDocument);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = fileName;
    a.click();
  };
</script>

<Button onclick={() => exportFlowToSVG(imageWidth, imageHeight)}>Download SVG</Button>
