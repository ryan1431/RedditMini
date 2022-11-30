export interface ThemeInfo {
  theme: Theme,
  text: RGB,
  border: RGB,
  front: RGB,
  front_alt: RGB,
  back: RGB,
  back_alt: RGB,
}
export interface RGB {
  r: string | number,
  g: string | number,
  b: string | number
}
export type Theme = 'default-dark' | 'default-light';

export const themes: ThemeInfo[] = [{
  theme: 'default-dark',
  text: {r: 255, g: 255, b: 255},
  border: {r: 65, g: 65, b: 90},
  front: {r: 35, g: 35, b: 35},
  front_alt: {r: 50, g: 50, b: 50},
  back: {r: 0, g: 0, b: 0},
  back_alt: {r: 0, g: 0, b: 0},
}, {
  theme: 'default-light',
  text: {r: 0, g: 0, b: 0},
  border: {r: 0, g: 0, b: 0},
  front: {r: 210, g: 210, b: 220},
  front_alt: {r: 170, g: 170, b: 170},
  back: {r: 255, g: 255, b: 255},
  back_alt: {r: 0, g: 0, b: 0},
}]