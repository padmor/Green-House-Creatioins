// Tiny site-wide notification bus: any client component calls toast("…") and <Toaster /> shows it.
export type Toast = { id: number; text: string; tone: "success" | "info" | "error" };

export const TOAST_EVENT = "gbc:toast";

export function toast(text: string, tone: Toast["tone"] = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Omit<Toast, "id">>(TOAST_EVENT, { detail: { text, tone } }));
}
