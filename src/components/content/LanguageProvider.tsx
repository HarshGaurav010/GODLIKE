"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ContentMode } from "@/content/types";

const storageKey = "isle-content-mode";
const changeEvent = "isle-language-change";
let sessionMode: ContentMode = "pirate";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function getSnapshot(): ContentMode {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === "original" || stored === "pirate" ? stored : sessionMode;
  } catch {
    return sessionMode;
  }
}

function setMode(mode: ContentMode) {
  sessionMode = mode;
  try {
    localStorage.setItem(storageKey, mode);
  } catch {
    /* The current tab still works if storage is disabled. */
  }
  window.dispatchEvent(new Event(changeEvent));
}

const LanguageContext = createContext<{
  mode: ContentMode;
  setMode: typeof setMode;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "pirate" as ContentMode,
  );
  return (
    <LanguageContext.Provider value={{ mode, setMode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("Language content must be wrapped in LanguageProvider.");
  return context;
}
