"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "khodroyar:v1:";

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export function clearLocal(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIX + key);
}

/**
 * state پایدار روی localStorage — داده‌ها فقط در مرورگر نگهداری می‌شوند
 */
export function useLocalStore<T>(key: string, initial: T) {
  const initialRef = useRef(initial);
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(readLocal<T>(key, initialRef.current));
    setReady(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeLocal(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return { value, setValue: update, ready };
}

export function exportJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
