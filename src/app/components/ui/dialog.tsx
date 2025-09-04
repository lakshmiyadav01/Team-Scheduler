// components/ui/dialog.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

type DialogContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

/**
 * Dialog - provides context and handles body scroll lock.
 *
 * Usage:
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogContent> ... </DialogContent>
 * </Dialog>
 */
export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  // Render provider even if closed so consumers don't crash during SSR/hydration,
  // but child content is portaled only when open.
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {mounted ? children : null}
    </DialogContext.Provider>
  );
}

/**
 * DialogContent - the actual modal pane (portaled to document.body)
 * It handles: ESC to close, backdrop click to close, and basic focus handling.
 */
export function DialogContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("DialogContent must be used inside <Dialog />");
  const { open, onOpenChange } = ctx;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;

    // Focus the panel (or the first focusable element inside)
    const panel = panelRef.current;
    const focusable =
      panel?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) ?? panel;
    focusable?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // restore focus
      lastActiveRef.current?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onMouseDown={() => onOpenChange(false)}
        aria-hidden
      />

      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900 ${className}`}
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop click when clicking inside
        tabIndex={-1}
      >
        {children}

        {/* small accessible close button (visible to keyboard users) */}
        <button
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 rounded p-1 text-sm hover:opacity-80"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}

/* Simple header + title primitives used by your modal component */
export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}
/* NEW: DialogDescription primitive */
export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
