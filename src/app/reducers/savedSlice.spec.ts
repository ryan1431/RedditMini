import savedSliceReducer, {
  save,
  unsave,
} from './savedSlice';

import { samplePost } from '../../utility/data';
import type { SavedState } from './savedSlice';

describe('savedSlice', () => {
  const initialState: SavedState = {
    savedPosts: []
  }

  it('should handle initial state', () => {
    expect(savedSliceReducer(undefined, { type: 'unknown'})).toEqual(initialState);
  });

  it('should properly add a saved post', () => {
    const actual = savedSliceReducer(initialState, save(samplePost));
    const expected = { savedPosts: [samplePost] }

    expect(actual).toEqual(expected);
  });

  it('should properly remove a saved post', () => {});
    const actual = savedSliceReducer({ savedPosts: [samplePost] }, unsave(samplePost));
    const expected = initialState;

    expect(actual).toEqual(expected);
});
