"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

// Small "copy" icon button placed next to an email address or phone number.
export function CopyButton({ value, label, light = false, className = "" }: { value: string; label: string; light?: boolean; className?: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      toast(`${label} copied`);
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      toast(`Could not copy. The ${label.toLowerCase()} is ${value}`, "info");
    }
  };

  const Icon = done ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label.toLowerCase()}`}
      title={`Copy ${label.toLowerCase()}`}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
        light ? "text-white/50 hover:bg-white/10 hover:text-white" : "text-muted hover:bg-forest-100 hover:text-forest-900"
      } ${className}`}
    >
      <Icon size={14} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
