import savedSliceReducer, {
  save,
  unsave,
} from './savedSlice';

import { samplePosts } from '../../utility/data';
import type { SavedState } from './savedSlice';

describe('savedSlice', () => {
  const initialState: SavedState = {
    refUrls: []
  }
  const initialStateWithPosts = {
    refUrls: [...samplePosts],
  }

  it('should handle initial state', () => {
    expect(savedSliceReducer(undefined, { type: 'unknown'})).toEqual(initialState);
  });

  it('should properly add saved urls to state', () => {
    const actual = savedSliceReducer(initialState, save(samplePosts[0]));
    expect(actual.refUrls[0]).toEqual(samplePosts[0]);
  });

  it('should properly unsave a url', () => {
    const actual = savedSliceReducer(initialStateWithPosts, unsave(samplePosts[2]));
    const expected = [...samplePosts.slice(0, 2), ...samplePosts.slice(3)];
    expect(actual.refUrls).toEqual(expected);
  });
});
