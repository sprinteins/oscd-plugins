export const TEXT_SIZES = {
  H1: 20,
  H2: 16,
  H3: 14,
  NORMAL: 10,
} as const;

export const FONT_STYLES = {
  NORMAL: "normal",
  BOLD: "bold",
  ITALIC: "italic",
} as const;

export const IMAGE_SCALE_FACTORS = {
  small: 0.25,
  medium: 0.5,
  large: 1,
} as const;

export const PDF_CONSTANTS = {
  DEFAULT_FONT_SIZE: TEXT_SIZES.NORMAL,
  INITIAL_PAGE_MARGIN: 10,
  DEFAULT_LINE_HEIGHT: 7,
  HORIZONTAL_SPACING: 10,
  MAX_IMAGE_WIDTH: 186,
  TEXT_MARGIN_OFFSET: 35,
  PAGE_BUFFER: 10,
  NESTED_LIST_INDENT: 10,
} as const;
