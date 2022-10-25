import {
  formatUrl
} from './fetch-format';


describe('formatUrl()', () => {
  let base = 'https://www.reddit.com/';

  it('should not change a url that already includes .json', () => {;
    expect(formatUrl(`${base}.json`)).toEqual(`${base}.json`);
  });

  it('should add .json to a reddit url that does not contain query params', () => {
    expect(formatUrl(base)).toEqual(`${base}.json`);
  });

  it('should add .json to the proper location when provided a url with query params', () => {
    let query = '?limit=10';
    expect(formatUrl(`${base}${query}`)).toEqual(`${base}.json${query}`);
  });
});

