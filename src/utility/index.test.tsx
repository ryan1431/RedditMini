import { selectRandomFromArray } from './';

test('selectRandomFromArray returns proper values', () => {
  // setup
  const values = ['hello', 'goodbye', 'yessir', 'chicken', 'treason!'];

  // exercise
  const result = selectRandomFromArray<string>(values);

  // verify 
  expect(result).not.toBeNull;
  expect(values).toContain(result);
});