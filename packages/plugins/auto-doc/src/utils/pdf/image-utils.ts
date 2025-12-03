import { IMAGE_SCALE_FACTORS, type ImageScale } from "./constants"

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
    img.src = dataUrl
  })
}

export function getImageScaleFactor(scale: string): number {
  const normalizedScale = scale.toLowerCase() as ImageScale
  return IMAGE_SCALE_FACTORS[normalizedScale] ?? IMAGE_SCALE_FACTORS.small
}

export function extractImageFormat(dataUrl: string): string | null {
  try {
    const parts = dataUrl.split(';')[0]?.split('/')
    return parts?.[1] ?? null
  } catch {
    return null
  }
}
