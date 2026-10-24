"use client";

import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delay` ms,
// so expensive work (like searching) runs once per pause in typing.
export default function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
