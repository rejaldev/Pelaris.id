import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useDebounceCallback,
  useDebounceValue,
  useThrottleCallback,
  usePrevious,
  useStableCallback,
  useMemoFilter,
  useMemoSort,
  useMemoMap,
  useLazyValue,
} from './useMemoization';

describe('useMemoization Hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useDebounceCallback', () => {
    it('should debounce callback calls', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebounceCallback(callback, 300));

      // Call multiple times rapidly
      act(() => {
        result.current('a');
        result.current('b');
        result.current('c');
      });

      // Should not have called yet
      expect(callback).not.toHaveBeenCalled();

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should have been called once with last value
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('c');
    });

    it('should reset timer on each call', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebounceCallback(callback, 300));

      act(() => {
        result.current('a');
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current('b');
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(callback).toHaveBeenCalledWith('b');
    });
  });

  describe('useDebounceValue', () => {
    it('should debounce value updates', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounceValue(value, 300),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('useThrottleCallback', () => {
    it('should throttle callback calls', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottleCallback(callback, 300));

      // First call should execute immediately
      act(() => {
        result.current('a');
      });
      expect(callback).toHaveBeenCalledWith('a');
      expect(callback).toHaveBeenCalledTimes(1);

      // Subsequent calls within interval should be ignored
      act(() => {
        result.current('b');
        result.current('c');
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // After interval, should allow new call
      act(() => {
        vi.advanceTimersByTime(300);
      });

      act(() => {
        result.current('d');
      });
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('d');
    });
  });

  describe('usePrevious', () => {
    it('should return previous value', () => {
      const { result, rerender } = renderHook(
        ({ value }) => usePrevious(value),
        { initialProps: { value: 1 } }
      );

      // Initially undefined
      expect(result.current).toBeUndefined();

      // After update, should have previous value
      rerender({ value: 2 });
      expect(result.current).toBe(1);

      rerender({ value: 3 });
      expect(result.current).toBe(2);
    });
  });

  describe('useStableCallback', () => {
    it('should maintain stable reference', () => {
      const { result, rerender } = renderHook(
        ({ fn }) => useStableCallback(fn),
        { initialProps: { fn: () => 'a' as string } }
      );

      const firstRef = result.current;

      rerender({ fn: () => 'b' as string });

      // Reference should be stable
      expect(result.current).toBe(firstRef);

      // But should use latest closure
      expect(result.current()).toBe('b');
    });
  });

  describe('useMemoFilter', () => {
    it('should filter items', () => {
      const items = [1, 2, 3, 4, 5];
      const { result } = renderHook(() =>
        useMemoFilter(items, (n) => n > 2, [])
      );

      expect(result.current).toEqual([3, 4, 5]);
    });

    it('should update when deps change', () => {
      const items = [1, 2, 3, 4, 5];
      const { result, rerender } = renderHook(
        ({ threshold }) =>
          useMemoFilter(items, (n) => n > threshold, [threshold]),
        { initialProps: { threshold: 2 } }
      );

      expect(result.current).toEqual([3, 4, 5]);

      rerender({ threshold: 3 });
      expect(result.current).toEqual([4, 5]);
    });
  });

  describe('useMemoSort', () => {
    it('should sort items', () => {
      const items = [3, 1, 4, 1, 5, 9, 2, 6];
      const { result } = renderHook(() =>
        useMemoSort(items, (a, b) => a - b, [])
      );

      expect(result.current).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should not mutate original array', () => {
      const items = [3, 1, 2];
      renderHook(() => useMemoSort(items, (a, b) => a - b, []));

      expect(items).toEqual([3, 1, 2]);
    });
  });

  describe('useMemoMap', () => {
    it('should map items', () => {
      const items = [1, 2, 3];
      const { result } = renderHook(() =>
        useMemoMap(items, (n) => n * 2)
      );

      expect(result.current).toEqual([2, 4, 6]);
    });

    it('should provide index to map function', () => {
      const items = ['a', 'b', 'c'];
      const { result } = renderHook(() =>
        useMemoMap(items, (item, i) => `${item}-${i}`)
      );

      expect(result.current).toEqual(['a-0', 'b-1', 'c-2']);
    });
  });

  describe('useLazyValue', () => {
    it('should compute value only once', () => {
      const factory = vi.fn(() => 'computed');
      const { result, rerender } = renderHook(() => useLazyValue(factory));

      expect(result.current).toBe('computed');
      expect(factory).toHaveBeenCalledTimes(1);

      rerender();
      rerender();
      rerender();

      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
