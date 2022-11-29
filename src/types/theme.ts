export interface ThemeInfo {
  theme: Theme,
  font_color: RGB,
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
export type Theme = 'dark' | 'light';