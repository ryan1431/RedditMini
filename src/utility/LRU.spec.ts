import { sampleSubMeta } from "../types";
import LRU from "./LRU";

// Setup

describe("LRU", () => {
  const sampleLRU = new LRU(5);

  beforeEach(() => {

    sampleLRU.clear();
    sampleLRU.set('a', sampleSubMeta);
    sampleLRU.set('b', sampleSubMeta);
    sampleLRU.set('c', sampleSubMeta);
  });

  it('should update max size when the parameter is provided', () => {
    const LRUCache = new LRU(15);
    expect(LRUCache.maxSize).toEqual(15);
  });

  it('should properly add a node to the LRU', () => {
    sampleLRU.set('d', sampleSubMeta);

    expect(sampleLRU.get('d')).not.toBeNull();
    expect(sampleLRU.head?.key).toEqual('d');

  })
})


