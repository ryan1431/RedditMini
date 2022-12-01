export interface ThemeInfo {
  theme: string,
  text: RGB,
  border: RGB,
  front: RGB,
  front_alt: RGB,
  back: RGB,
  back_alt: RGB,
  backImage?: string,
}
export interface RGB {
  r: string | number,
  g: string | number,
  b: string | number
}

export const themes: ThemeInfo[] = [{
  theme: 'default-dark',
  text: {r: 255, g: 255, b: 255},
  border: {r: 65, g: 65, b: 65},
  front: {r: 35, g: 35, b: 35},
  front_alt: {r: 50, g: 50, b: 50},
  back: {r: 0, g: 0, b: 0},
  back_alt: {r: 60, g: 60, b: 60},
}, {
  theme: 'default-light',
  text: {r: 0, g: 0, b: 0},
  border: {r: 125, g: 125, b: 125},
  front: {r: 255, g: 255, b: 255},
  front_alt: {r: 235, g: 235, b: 235},
  back: {r: 220, g: 220, b: 230},
  back_alt: {r: 200, g: 200, b: 240},
}, {
  theme: 'blue-dark',
  text: {r: 200, g: 220, b: 255},
  border: {r: 40, g: 40, b: 65},
  front: {r: 20, g: 20, b: 35},
  front_alt: {r: 30, g: 30, b: 50},
  back: {r: 0, g: 0, b: 20},
  back_alt: {r: 40, g: 40, b: 60},
}, {
  theme: 'blue-light',
  text: {r: 0, g: 80, b: 120},
  border: {r: 100, g: 100, b: 125},
  front: {r: 220, g: 220, b: 255},
  front_alt: {r: 190, g: 190, b: 235},
  back: {r: 195, g: 195, b: 230},
  back_alt: {r: 200, g: 200, b: 240},
}, {
  theme: 'green-dark',
  text: {r: 210, g: 255, b: 210},
  border: {r: 40, g: 65, b: 40},
  front: {r: 10, g: 45, b: 10},
  front_alt: {r: 20, g: 50, b: 20},
  back: {r: 0, g: 20, b: 0},
  back_alt: {r: 20, g: 60, b: 20},
}, {
  theme: 'green-light',
  text: {r: 0, g: 0, b: 0},
  border: {r: 100, g: 125, b: 100},
  front: {r: 210, g: 255, b: 210},
  front_alt: {r: 190, g: 235, b: 190},
  back: {r: 200, g: 220, b: 200},
  back_alt: {r: 200, g: 240, b: 200},
}]





//https://images.unsplash.com/photo-1530625243345-797b4c1836ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80