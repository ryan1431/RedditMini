import LRU from "./LRU";

describe("LRU", () => {
  const sample = new LRU<string, number>(5);

  beforeEach(() => {
    sample.clear();
    sample.set('a', 1);
    sample.set('b', 2);
    sample.set('c', 3);
  });

  it('should update max size when the parameter is provided', () => {
    const LRUCache = new LRU(15);
    expect(LRUCache.maxSize).toEqual(15);
  });

  it('should properly add a node to the head of the LRU', () => {
    const size = sample.size;
    sample.set('d', 4);

    expect(sample.head?.key).toEqual('d');
    expect(sample.size).toEqual(size + 1);
  });

  it('should return a value from the cacheMap if it exists', () => {
    expect(sample.get('b')).toEqual(2);
  });

  it('should return null if no value exists', () => {
    const size = sample.size;

    expect(sample.get('e')).toBeNull();
    expect(sample.size).toEqual(size);
  })

  it('should bubble up a value when it is read', () => {
    sample.get('a');
    const size = sample.size;

    expect(sample.head?.key).toEqual('a');
    expect(sample.tail?.key).toEqual('b');
    expect(sample._findNode('a')?.next?.key).toEqual('c');
    expect(sample.size).toEqual(size);
  });

  it('should properly clear all values and set size to zero when using clear()', () => {
    sample.clear();

    expect(sample.head).toBeNull();
    expect(sample.tail).toBeNull();
    expect(sample.size).toEqual(0);
  });
})


