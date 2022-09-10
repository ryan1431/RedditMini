/** Select and return a random element from an array.
 * 
 * @param arr Array to pick element from
 * @returns A random element from given array or undefined if empty
 */
const randomElementFromArray = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}


export { 
  randomElementFromArray,
}