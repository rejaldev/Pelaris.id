import { useMemo, useCallback, useRef, useEffect, DependencyList } from 'react';

/**
 * Custom hook for debouncing a callback function
 * Useful for search inputs, resize handlers, etc.
 * 
 * @example
 * const debouncedSearch = useDebounceCallback((term) => {
 *   searchProducts(term);
 * }, 300);
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

/**
 * Custom hook for debouncing a value
 * Returns the debounced value after delay
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounceValue(search, 300);
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Need to import useState for useDebounceValue
import { useState } from 'react';

/**
 * Custom hook for throttling a callback function
 * Ensures callback is called at most once per interval
 * 
 * @example
 * const throttledScroll = useThrottleCallback(() => {
 *   updateScrollPosition();
 * }, 100);
 */
export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number
): T {
  const lastCallRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= interval) {
        lastCallRef.current = now;
        callbackRef.current(...args);
      }
    }) as T,
    [interval]
  );
}

/**
 * Custom hook for memoizing expensive computations with deep comparison
 * Use when dependencies are objects/arrays that might have same values but different references
 * 
 * @example
 * const processedData = useDeepMemo(() => {
 *   return heavyComputation(data);
 * }, [data]);
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  const ref = useRef<{ deps: DependencyList; value: T } | undefined>(undefined);

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

/**
 * Deep equality check for objects and arrays
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => deepEqual(a[key], b[key]));
  }
  
  return false;
}

/**
 * Custom hook to get previous value of a state/prop
 * Useful for comparing current vs previous values
 * 
 * @example
 * const prevCount = usePrevious(count);
 * if (count !== prevCount) { ... }
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Custom hook for stable callback reference
 * Similar to useCallback but always has the latest closure values
 * 
 * @example
 * const handleClick = useStableCallback(() => {
 *   console.log(someState); // Always has latest value
 * });
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Memoization helper for filtering arrays
 * Only recomputes when items or filter criteria change
 * 
 * @example
 * const filteredProducts = useMemoFilter(
 *   products,
 *   (product) => product.name.includes(search),
 *   [search]
 * );
 */
export function useMemoFilter<T>(
  items: T[],
  predicate: (item: T) => boolean,
  deps: DependencyList
): T[] {
  return useMemo(
    () => items.filter(predicate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, ...deps]
  );
}

/**
 * Memoization helper for sorting arrays
 * Only recomputes when items or sort criteria change
 * 
 * @example
 * const sortedProducts = useMemoSort(
 *   products,
 *   (a, b) => a.price - b.price,
 *   [sortDirection]
 * );
 */
export function useMemoSort<T>(
  items: T[],
  compareFn: (a: T, b: T) => number,
  deps: DependencyList
): T[] {
  return useMemo(
    () => [...items].sort(compareFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, ...deps]
  );
}

/**
 * Memoization helper for mapping arrays
 * Only recomputes when items change
 * 
 * @example
 * const productNames = useMemoMap(products, p => p.name);
 */
export function useMemoMap<T, U>(
  items: T[],
  mapFn: (item: T, index: number) => U,
  deps: DependencyList = []
): U[] {
  return useMemo(
    () => items.map(mapFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, ...deps]
  );
}

/**
 * Custom hook for lazy initialization of expensive values
 * Value is only computed once on first access
 * 
 * @example
 * const expensiveValue = useLazyValue(() => computeExpensiveValue());
 */
export function useLazyValue<T>(factory: () => T): T {
  const ref = useRef<{ value: T; initialized: boolean }>({ 
    value: undefined as T, 
    initialized: false 
  });
  
  if (!ref.current.initialized) {
    ref.current.value = factory();
    ref.current.initialized = true;
  }
  
  return ref.current.value;
}

/**
 * Custom hook for intersection observer (lazy loading, infinite scroll)
 * 
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   onIntersect: () => loadMore()
 * });
 * return <div ref={ref}>...</div>
 */
export function useIntersectionObserver(options: {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: () => void;
  enabled?: boolean;
}) {
  const { threshold = 0, rootMargin = '0px', onIntersect, enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && onIntersect) {
          onIntersect();
        }
      },
      { threshold, rootMargin }
    );

    const target = targetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [threshold, rootMargin, onIntersect, enabled]);

  return { ref: targetRef, isIntersecting };
}
