import { useState, useEffect } from 'react';

// This hook takes a value and a delay, and only returns the latest value 
// after the specified delay has passed without any new changes.
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if the value changes again
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};