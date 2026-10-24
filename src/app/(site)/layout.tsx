import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { FloatingActions } from "@/components/FloatingActions";
import { Reveal } from "@/components/Reveal";
import { getAnnouncements } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const announcements = await getAnnouncements();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-bone focus:p-3">
        Skip to content
      </a>
      <Header announcements={announcements} />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer />
      <Reveal />
      <EnquiryModal />
      <FloatingActions />
    </>
  );
}
