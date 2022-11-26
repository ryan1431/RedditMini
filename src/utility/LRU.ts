import { SubMeta } from "../types";

interface NodeLRU {
  key: string,
  prev: NodeLRU | null,
  next: NodeLRU | null,
}

class NodeLRU {
  constructor(key: string, prev: NodeLRU | null = null, next:NodeLRU | null = null) {
    this.key = key;
    this.prev = prev || null;
    this.next = next || null;
  }
}

interface LRU {
  head: NodeLRU | null,
  tail: NodeLRU | null,
  size: number,
  maxSize: number,
  cacheMap: Map<string, SubMeta>,
}

class LRU {
  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.cacheMap = new Map();
  }

  // UI 
  get(key: string) {
    let existing = this._findNode(key);

    if (existing) {
      this.head !== existing && this._bubbleUp(existing);
      return this.cacheMap.get(existing.key);
    } 

    return null;    
  }

  set(key: string, value: any) {
    let node = new NodeLRU(key, null, this.head);
    this._add(node);
    this.cacheMap.set(key, value);
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.cacheMap.clear();
  }

  // Internal
  _findNode(key: string) {
    const traverse = (node: NodeLRU): NodeLRU | null => {
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

  _bubbleUp(node: NodeLRU) {
    this._detach(node);
    this._add(node);
  }

  _add(node: NodeLRU) {
    // Drop LRU
    if (this.size === this.maxSize) {
      const tailNode = this.tail;
      tailNode!.prev!.next = null;
      this.tail = tailNode!.prev;
      this.cacheMap.delete(tailNode!.key);
      this.size--;
    } 

    if (this.head) {
      this.head.prev = node;
      this.head = node;
      this.size++;
    } else {
      this.head = node;
      this.tail = node;
      this.size++;
    }
  }

  _detach(node: NodeLRU) {
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