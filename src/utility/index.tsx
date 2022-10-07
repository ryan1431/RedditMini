/** Select and return a random element from an array.
 * 
 * @param arr Array to pick element from
 * @returns A random element from given array or undefined if empty
 */
const getRandomFromArray = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export { 
  getRandomFromArray,
}


// formatting.tsx
export * from './fetch-format'

// types.tsx
export * from './types'