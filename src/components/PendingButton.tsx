"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

// Submit button that shows a spinner and "working" text while its form is being processed.
export function PendingButton({
  children,
  pendingText,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  pendingText: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} onClick={onClick} className={`inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-70 ${className}`}>
      {pending && <LoaderCircle size={14} strokeWidth={2} className="animate-spin" aria-hidden />}
      {pending ? pendingText : children}
    </button>
  );
}
