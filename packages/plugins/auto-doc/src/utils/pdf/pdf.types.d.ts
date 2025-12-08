import type { TEXT_SIZES, FONT_STYLES, IMAGE_SCALE_FACTORS } from './constants'

export type TextSize = typeof TEXT_SIZES[keyof typeof TEXT_SIZES]
export type FontStyle = typeof FONT_STYLES[keyof typeof FONT_STYLES]
export type ImageScale = typeof IMAGE_SCALE_FACTORS[keyof typeof IMAGE_SCALE_FACTORS]
