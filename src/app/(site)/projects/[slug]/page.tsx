import { redirect } from "next/navigation";

export default function LegacyProjectRedirect() {
  redirect("/projects");
}
