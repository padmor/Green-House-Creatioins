"use client";

import { useEffect } from "react";
import { toast } from "@/lib/toast";

// Tells the visitor when their connection drops or comes back, so failed actions make sense.
export function NetworkStatus() {
  useEffect(() => {
    const off = () => toast("You're offline. Check your connection; forms can't be sent until you're back online.", "error");
    const on = () => toast("You're back online.");
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    return () => {
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
    };
  }, []);
  return null;
}
