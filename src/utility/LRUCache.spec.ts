import LRU from "./LRUCache";

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
  });

  it('should drop LRU from list & cacheMap if adding a value when it is full', () => {
    sample.set('d', 4);
    sample.set('e', 5);
    sample.set('f', 6);

    expect(sample.head?.key).toEqual('f');
    expect(sample.tail?.key).toEqual('b');
    expect(sample.get('a')).toBeNull();
    expect(sample._cacheMap.get('a')).toBeUndefined();
  })

  it('should bubble up & reattach a value when it is read', () => {
    sample.get('a');
    const size = sample.size;

    expect(sample.head?.key).toEqual('a');
    expect(sample.tail?.key).toEqual('b');
    expect(sample.size).toEqual(size);

    // Verify 'a' is still linked to the list and not just set as the head
    sample.get('b');
    sample.get('c');
    
    expect(sample.tail?.key).toEqual('a');
  });

  it('should properly clear all values and set size to zero when using clear()', () => {
    sample.clear();

    expect(sample.head).toBeNull();
    expect(sample.tail).toBeNull();
    expect(sample.size).toEqual(0);
  });
})


