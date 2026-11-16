import type { Metadata } from "next";
import Link from "next/link";
import { can, requireStaff } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { PendingButton } from "@/components/PendingButton";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s | GBC Job Desk" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  const links = [
    { href: "/dashboard", label: "Overview", show: true },
    { href: "/dashboard/enquiries", label: "Job requests", show: can.workEnquiries(staff.role) },
    { href: "/dashboard/tradespeople", label: "Tradespeople", show: can.verifyTradespeople(staff.role) },
    { href: "/dashboard/content", label: "Website content", show: can.editContent(staff.role) },
    { href: "/dashboard/announcements", label: "Announcements", show: can.editContent(staff.role) },
    { href: "/dashboard/people", label: "Founder & team", show: can.editContent(staff.role) },
    { href: "/dashboard/team", label: "Staff accounts", show: can.manageTeam(staff.role) },
  ].filter((l) => l.show);

  return (
    <div className="min-h-dvh bg-bone">
      <header className="border-b border-stone bg-forest-900 text-bone">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Link href="/dashboard" className="font-serif text-lg">GBC Job Desk</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-bone/70 sm:inline">{staff.full_name || staff.email} · {staff.role}</span>
            <Link href="/" className="text-bone/70 hover:text-bone">View site</Link>
            <form action={logout}><PendingButton pendingText="Signing out…" className="underline underline-offset-4 hover:text-brass">Sign out</PendingButton></form>
          </div>
        </div>
        <nav aria-label="Dashboard" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 sm:px-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap px-3 py-2.5 text-sm text-bone/75 hover:text-bone">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
