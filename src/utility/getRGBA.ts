import { RGB } from "../types/theme";

export const getRGBA = (style: RGB | string, alpha: number = 1) => {
  if (typeof style === 'string') {
    if (style[0] === '#') {
      return `${style}${hexOpacities[alpha*10]}`
    }

    return style;
  }

  const {r, g, b} = style;
  if (alpha) return `rgba(${r},${g},${b},${alpha})`;
  return `rgb(${r},${g},${b})`;
}


const hexOpacities: any = {
  10: 'ff',
  9: 'e6',
  8: 'cc',
  7: 'b3',
  6: '99',
  5: '80',
  4: '66',
  3: '4d',
  2: '33',
  1: '1a',
}