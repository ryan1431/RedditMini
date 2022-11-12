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
    let actual = querySliceReducer(initialState, setQuery(['feed', 'custom']));
    let expected = { ...initialState, feed: 'custom' };
    expect(actual).toEqual(expected);

    actual = querySliceReducer(initialState, setQuery(['sort', 'hot']));
    expected = { ...initialState, sort: 'hot' };
    expect(actual).toEqual(expected);

    actual = querySliceReducer(initialState, setQuery(['sort', 'y31351']));
    expected = { ...initialState, sort: 'y31351' };
    expect(actual).toEqual(expected);
  })
});