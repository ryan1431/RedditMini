const getRandomFromArray = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export { 
  getRandomFromArray,
}


// fetch-format.tsx
export * from './fetch-format'

// types.tsx
export * from './types'