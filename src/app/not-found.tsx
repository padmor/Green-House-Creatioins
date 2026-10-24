import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// Shown for unknown URLs and for missing projects. Renders outside the (site) layout,
// so it brings its own header and footer.
export default function NotFound() {
  const btn = "group inline-flex items-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors";
  return (
    <>
      <Header solid />
      <main id="main" className="bg-bone pt-[72px]">
        <section className="container-gbc flex min-h-[calc(100svh-72px-140px)] flex-col items-center justify-center py-20 text-center">
          <LogoMark size={56} className="opacity-25" />
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-forest-900/80">Error 404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-forest-900 sm:text-5xl">Page not found</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/75">
            The page you were looking for has moved or no longer exists. Try one of these instead.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/" className={`${btn} bg-ink text-bone hover:bg-ink-soft`}>
              Back to home
            </Link>
            <Link href="/projects" className={`${btn} border border-ink text-ink hover:bg-ink hover:text-bone`}>
              Our projects
            </Link>
            <Link href="/contact" className={`${btn} border border-ink text-ink hover:bg-ink hover:text-bone`}>
              Contact us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
