import { LoaderCircle } from "lucide-react";

// Button content that swaps to a spinner plus "working" text while an action is processing.
export function BusyLabel({ pending, busy, children }: { pending: boolean; busy: string; children: React.ReactNode }) {
  if (!pending) return <>{children}</>;
  return (
    <>
      <LoaderCircle size={14} strokeWidth={2} className="animate-spin" aria-hidden /> {busy}
    </>
  );
}
