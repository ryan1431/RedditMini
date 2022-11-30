import { RGB } from "../types/theme";

export const getRGBA = ({r, g, b}: RGB, alpha?: number) => {
  if (alpha) return `rgba(${r},${g},${b},${alpha})`;
  return `rgb(${r},${g},${b})`;
}