"use client";
import { useEffect, useRef } from "react";
import { Icon } from "./Icons";

export function DialogPanel({
  open,
  title,
  closeLabel,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    } else if (!open && dialog.open) dialog.close();
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="site-dialog"
      aria-labelledby="panel-heading"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
    >
      <div className="panel-surface">
        <div className="panel-heading">
          <h2 id="panel-heading">{title}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label={closeLabel}
            onClick={() => ref.current?.close()}
          >
            <Icon kind="close" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
