interface NodeLRU<K> {
  key: K,
  prev: NodeLRU<K> | null,
  next: NodeLRU<K> | null,
}

class NodeLRU<K> {
  constructor(key: K, prev: NodeLRU<K> | null = null, next:NodeLRU<K> | null = null) {
    this.key = key;
    this.prev = prev || null;
    this.next = next || null;
  }
}

interface LRU<K, V> {
  head: NodeLRU<K> | null,
  tail: NodeLRU<K> | null,
  size: number,
  maxSize: number,
  cacheMap: Map<K, V>,
}

class LRU<K, V> {
  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.cacheMap = new Map();
  }

  // UI 
  get(key: K) {
    let existing = this._findNode(key);

    if (existing) {
      this.head !== existing && this._bubbleUp(existing);
      return this.cacheMap.get(existing.key);
    } 

    return null;    
  }

  set(key: K, value: V) {
    let node = new NodeLRU(key, null, this.head);
    this._add(node);
    this.cacheMap.set(key, value);
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.cacheMap.clear();
  }

  logTraverse(node = this.head) {
    if (node === this.head) {
      console.log('*head*');
    }
    console.log(`${node?.key || ''} ${node?.next ? '\n|' : ''}`);
    if (node === this.tail) {
      console.log('*tail');
    }
    if (node?.next) this.logTraverse(node.next);
  }

  // Internal
  private _findNode(key: K) {
    const traverse = (node: NodeLRU<K>): NodeLRU<K> | null => {
      return node.key === key
        ? node
        : node.next 
          ? traverse(node.next)
          : null;
    }

    return this.head
      ? traverse(this.head)
      : null
  }

  private _bubbleUp(node: NodeLRU<K>) {
    this._detach(node);
    this._add(node);
  }

  private _add(node: NodeLRU<K>) {
    // Drop LRU
    if (this.size === this.maxSize) {
      const tailNode = this.tail as NodeLRU<K>;
      tailNode!.prev!.next = null;
      this.tail = tailNode.prev;
      this.cacheMap.delete(tailNode.key);
      this.size--;
    } 

    if (this.head) {
      node.next = this.head;
      this.head.prev = node;
      
      this.head = node;
      this.size++;
    } else {
      this.head = node;
      this.tail = node;
      this.size++;
    }
  }

  private _detach(node: NodeLRU<K>) {
    if (!node.prev && !node.next) {
      this.head = null;
      this.tail = null;
    }
    
    if (node.prev) {
      if (node.next) {
        node.prev.next = node.next;
      } else {
        node.prev.next = null;
        this.tail = node.prev;
      }
    }
  
    if (node.next) {
      if (node.prev) {
        node.next.prev = node.prev;
      } else {
        node.next.prev = null;
        this.head = node.next;
      }
    }
  
    node.next = null;
    node.prev = null;
    this.size--;
  }

}

export default LRU;