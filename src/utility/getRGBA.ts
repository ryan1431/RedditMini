import { RGB } from "../types/theme";

export const getRGBA = (style: RGB | string, alpha?: number) => {
  if (typeof style === 'string') {
    return style;
  }

  const {r, g, b} = style;
  if (alpha) return `rgba(${r},${g},${b},${alpha})`;
  return `rgb(${r},${g},${b})`;
}
