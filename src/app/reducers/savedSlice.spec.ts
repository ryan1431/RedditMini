import savedSliceReducer, {
  save,
  unsave,
} from './savedSlice';

import { samplePost } from '../../utility/data';
import { initialState } from './savedSlice';

describe('savedSlice', () => {

  it('should handle initial state', () => {
    expect(savedSliceReducer(undefined, { type: 'unknown'})).toEqual(initialState);
  });

  it('should properly add a saved post', () => {
    const actual = savedSliceReducer(initialState, save(samplePost));
    const expected = { ...initialState, savedPosts: [samplePost] }

    expect(actual).toEqual(expected);
  });

  it('should properly remove a saved post', () => {});
    const actual = savedSliceReducer({ ...initialState, savedPosts: [samplePost] }, unsave(samplePost));
    const expected = initialState;

    expect(actual).toEqual(expected);
});
