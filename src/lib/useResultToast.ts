"use client";

import { useEffect } from "react";
import { toast } from "./toast";

// Pops up "Saved" (or the error) whenever a dashboard form returns a result.
export function useResultToast(state: { ok?: boolean; error?: string }, okText = "Changes saved") {
  useEffect(() => {
    if (state.ok) toast(okText);
    else if (state.error) toast(state.error, "error");
  }, [state, okText]);
}
