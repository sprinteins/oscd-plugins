import { toPng } from "html-to-image";

type Base64String = string;

type ExportProps = {
  element: HTMLElement;
};

type ExportPNGProps = ExportProps & {
  imageWidth?: number;
  imageHeight?: number;
  backgroundColor?: string;
  pixelRatio?: number;
  quality?: number;
};

export async function renderPngFromHtml({
  element,
  imageWidth,
  imageHeight,
  backgroundColor = "var(--global-background-color)",
  pixelRatio = 2,
  quality = 1,
}: ExportPNGProps): Promise<Base64String> {
  const width = imageWidth || element.offsetWidth || 1024;
  const height = imageHeight || element.offsetHeight || 768;
  try {
    const dataUrl = await toPng(element, {
      backgroundColor,
      width,
      height,
      pixelRatio,
      quality,
      cacheBust: true,
      skipFonts: true,
    });

    return extractBase64FromDataUrl(dataUrl);
  } catch {
    throw new Error("Exporting toPNG failed.");
  }
}

function extractBase64FromDataUrl(dataUrl: string): string {
  const base64Index = dataUrl.indexOf(",");
  return base64Index !== -1 ? dataUrl.substring(base64Index + 1) : dataUrl;
}