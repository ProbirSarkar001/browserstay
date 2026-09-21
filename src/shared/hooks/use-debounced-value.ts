import { useEffect, useState } from "react";

/**
 * @human Returns a copy of `value` that only updates after `delay` ms of
 * inactivity. Useful for expensive parsing/formatting driven by a text input.
 */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
