/**
 * Simple implementation of a Least Recently Used (LRU) Cache.
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * Get an item from the cache. Moves the accessed item to the most recently used position.
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value); // Move to most recently used position
    return value;
  }

  /**
   * Set an item in the cache. Evicts the least recently used item if the cache is full.
   */
  set(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

/**
 * Memoize a function with an LRU Cache.
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  capacity: number = 100
): T {
  const cache = new LRUCache<string, ReturnType<T>>(capacity);

  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const cachedResult = cache.get(key);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Generates combinations for given indices.
 */
export function combinations(total: number, select: number): number[][] {
  const result: number[][] = [];
  function helper(start: number, selected: number[]) {
    if (selected.length === select) {
      result.push([...selected]);
      return;
    }
    for (let i = start; i < total; i++) {
      helper(i + 1, [...selected, i]);
    }
  }
  helper(0, []);
  return result;
}
