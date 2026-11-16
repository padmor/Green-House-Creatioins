import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { NavProgress } from "@/components/NavProgress";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Toaster } from "@/components/Toaster";
import { company } from "@/lib/content";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${company.name} | Trades & Job Matching, Cape Coast`, template: `%s | ${company.short}` },
  description:
    "Green-Building Creations Ltd. connects customers with skilled tilers, electricians, plumbers, carpenters and masons in Ghana. Post a job request, find reviewed trade professionals and coordinate the next steps.",
  openGraph: { type: "website", siteName: company.name, locale: "en_GH" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Arm scroll-reveal before first paint; undo it if the app script never runs. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__gbcReveal)document.documentElement.classList.remove('js')},4000)",
          }}
        />
      </head>
      <body className="min-h-dvh">
        <NavProgress />
        {children}
        <Toaster />
        <NetworkStatus />
      </body>
    </html>
  );
}
