import { getRelativeTime } from "./getRelativeTime";

describe('getRelativeTime', () => {
  it('should not declare seconds ago', () => {
    const a = getRelativeTime(new Date(Date.now() - (10 * 1000)));
    const e = 'Less than a minute ago'

    expect(a).toEqual(e);
  });

  it('should handle relative time', () => {
    const a = getRelativeTime(new Date(Date.now() - (1000 * 60 * 60 * 24 * 30 * 13)));
    const e = '1 year ago';

    expect(a).toEqual(e);
  });
});