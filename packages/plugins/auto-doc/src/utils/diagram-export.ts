import { toPng } from "html-to-image";

type Base64String = string;

type ExportProps = {
  element: HTMLElement;
};

type ExportPNGProps = ExportProps & {
  imageWidth?: number;
  imageHeight?: number;
  backgroundColor?: string;
};

export async function exportPngFromHTMLElement({
  element,
  imageWidth,
  imageHeight,
  backgroundColor = "var(--global-background-color)",
}: ExportPNGProps): Promise<Base64String> {
  // Use actual element dimensions if not specified
  const width = imageWidth || element.offsetWidth || 1024;
  const height = imageHeight || element.offsetHeight || 768;
  try {
    const dataUrl = await toPng(element, {
      backgroundColor,
      width,
      height,
      cacheBust: true,
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