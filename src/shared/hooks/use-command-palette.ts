import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return open;
}

function setOpen(next: boolean) {
  if (open === next) return;
  open = next;
  listeners.forEach((listener) => listener());
}

export function useCommandPalette() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { open: isOpen, setOpen };
}
