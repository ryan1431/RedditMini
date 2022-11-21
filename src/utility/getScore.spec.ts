import { getScore } from './getScore';

describe('getScore', () => {
  it('should properly format scores under 1000', () => {
    const a = getScore(300);
    const e = '300'

    expect(a).toEqual(e);
  });

  it('should properly round and format scores over 1000', () => {
    const a = getScore(1100);
    const e = '1.1k';

    expect(a).toEqual(e);
  });

  it('should leave out trailing 0s after rounding', () => {
    const a = getScore(20000);
    const e = '20k';

    expect(a).toEqual(e);
  });

  it('should properly round and formate scores over 10000', () => {
    const a = getScore(28980);
    const e = '28.9k';

    expect(a).toEqual(e);
  })

  it('should not round 6 digit numbers', () => {
    const a = getScore(113313);
    const e = '113k';

    expect(a).toEqual(e);
  });
});