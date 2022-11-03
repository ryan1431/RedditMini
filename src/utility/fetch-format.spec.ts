import {
  formatUrl
} from './fetch-format';


describe('formatUrl()', () => {
  let base = 'https://www.reddit.com/';

  it('should add raw_json=1 if not included', () => {;
    expect(formatUrl(`${base}.json`)).toEqual(`${base}.json?raw_json=1`);
  });

  it('should add .json if not included', () => {;
    expect(formatUrl(`${base}?raw_json=1`)).toEqual(`${base}.json?raw_json=1`);
  });

  it('should add .json to a reddit url that does not contain query params', () => {
    expect(formatUrl(base)).toEqual(`${base}.json?raw_json=1`);
  });

  it('should add .json to the proper location when provided a url with query params', () => {
    let query = '?limit=10';
    expect(formatUrl(`${base}${query}`)).toEqual(`${base}.json${query}&raw_json=1`);
  });
});

