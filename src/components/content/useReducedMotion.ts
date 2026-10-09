"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const list = matchMedia(query);
  list.addEventListener("change", callback);
  return () => list.removeEventListener("change", callback);
}

/** True on the server, so motion only starts after hydration. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => true,
  );
}
