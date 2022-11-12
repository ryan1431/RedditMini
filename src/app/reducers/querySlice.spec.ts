import querySliceReducer, {
  setQuery,
} from './querySlice';

import querySlice, { initialState, savedState } from './querySlice';

describe("querySlice", () => {
  it('should properly handle initial state', () => {
    const actual = querySlice(undefined, { type: 'unknown'});
    expect(actual).toEqual({...initialState, ...savedState} || initialState);
  })

  it('should update proper query fields given various inputs', () => {
    let actual = querySliceReducer(initialState, setQuery(['custom', 'feed']));
    let expected = { ...initialState, feed: 'custom' };
    expect(actual).toEqual(expected);

    actual = querySliceReducer(initialState, setQuery(['hot', 'sort']));
    expected = { ...initialState, sort: 'hot' };
    expect(actual).toEqual(expected);

    actual = querySliceReducer(initialState, setQuery(['y31351', 'sort']));
    expected = { ...initialState, sort: 'y31351' };
    expect(actual).toEqual(expected);
  })
});