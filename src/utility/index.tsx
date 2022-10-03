/** Select and return a random element from an array.
 * 
 * @param arr Array to pick element from
 * @returns A random element from given array or undefined if empty
 */
const getRandomFromArray = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Select a random level of popularity, to be used in vote calculation
 * 
 * @returns Popularity tier, with lower popularity being more likely than higher
 */
const getPopularity = (): number => {
  const popularity = [];
  let i = 0;
  for (let i = 0; i < 10; i++) {
    popularity.push(10);
  }
  for (let i = 0; i < 8; i++) {
    popularity.push(100);
  }
  for (let i = 0; i < 6; i++) {
    popularity.push(1000);
  }
  for (let i = 0; i < 4; i++) {
    popularity.push(10000);
  }
  for (let i = 0; i < 2; i++) {
    popularity.push(100000);
  }
  return getRandomFromArray(popularity);
}

const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
}

const getScore = () => {
  const popularity = getPopularity();
  const ups = Math.floor(Math.random() * popularity);
  const downs = Math.floor(Math.random() * popularity / 2); // most posts will have positive score
  const score = ups - downs;

  return {
    ups,
    downs,
    score
  }
}

export { 
  getRandomFromArray,
  getPopularity,
  getRandomNumber,
  getScore,
}

export {
  generatePost,
  generateComment,
} from './generateMockData';


export { 
  formatComments,
} from './formatting'