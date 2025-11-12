import { toPng } from "html-to-image";
import { getNodesBounds, getViewportForBounds, useNodes } from "@xyflow/svelte";

type exportProps = {
  flowPane: HTMLElement;
  fileName: string;
};

type exportPNGProps = exportProps & {
  imageWidth: number;
  imageHeight: number;
  backgroundColor: string;
};

export async function exportPngFromFlowPane({
  flowPane,
  imageWidth = 1024,
  imageHeight = 768,
  backgroundColor = "var(--global-background-color)",
}: exportPNGProps): Promise<string | undefined | Error> {
  const nodes = useNodes();
  const nodesBounds = getNodesBounds(nodes.current);
  const viewport = getViewportForBounds(
    nodesBounds,
    imageWidth,
    imageHeight,
    0.5,
    2.0,
    0.2
  );
  if (!viewport) {
    return new Error("Could not determine viewport for nodes bounds");
  }
  try {
    const dataUrl = await toPng(flowPane, {
      backgroundColor: backgroundColor,
      width: imageWidth,
      height: imageHeight,
      cacheBust: true,
    });

    return extractBase64FromDataUrl(dataUrl);
  } catch (err) {
    return new Error("toPng failed");
  }
}

export function extractBase64FromDataUrl(dataUrl: string): string {
  const base64Index = dataUrl.indexOf(",");
  return base64Index !== -1 ? dataUrl.substring(base64Index + 1) : dataUrl;
}
