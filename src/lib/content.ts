// Static, approved site copy and fallback data (contact details and projects confirmed by GBC).
// Company facts below come from GBC's verified information sheet. The founding year (2021, from the
// company LinkedIn profile) is deliberately not shown anywhere until GBC confirms it.

export const company = {
  name: "Green-Building Creations Ltd.",
  short: "GBC",
  tagline: "We Plan. We Design. We Build.",
  city: "Cape Coast",
  country: "Ghana",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@gbcghana.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+233 24 123 4567",
  // WhatsApp number in international format, digits only (e.g. 233241234567). Not set = no WhatsApp button.
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.replace(/\D/g, "") || undefined,
  region: "Central Region",
  address: "Cape Coast, Central Region, Ghana",
  postal: "P. O. Box UC 23, Cape Coast, Ghana",
  industry: "Construction",
  positioning: "Nature Inclusive Design & Build Firm",
  sustainability:
    "Our work, and how we work, contribute to a sustainable future for our people, our clients and society.",
  // Map centre / office pin (Cape Coast).
  coords: [5.1053, -1.2466] as [number, number],
  mission:
    "To deliver quality buildings on time, in safe working environments, with responsibility for the environment we build in.",
};

// Social links appear in the footer only when configured.
export const social = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN, icon: "linkedin" },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, icon: "instagram" },
  { label: "Facebook", href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, icon: "facebook" },
].filter((s): s is { label: string; href: string; icon: string } => Boolean(s.href));

export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Featured Projects" },
  { href: "/map", label: "Interactive Project Map" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = [
  ...nav,
  { href: "/services", label: "Services" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/careers", label: "Careers" },
] as const;

export const services = [
  {
    slug: "plan",
    verb: "Plan",
    title: "Planning",
    summary:
      "Site appraisal, feasibility, budgeting and programme planning so a project starts with clear scope and realistic expectations.",
    points: ["Site and feasibility assessment", "Budget and programme planning", "Permit and approvals guidance"],
  },
  {
    slug: "design",
    verb: "Design",
    title: "Architectural Design",
    summary:
      "Concept to construction drawings, shaped around how the building will be used, the local climate and the budget.",
    points: ["Concept and detailed design", "Construction documentation", "Climate-responsive thinking"],
  },
  {
    slug: "build",
    verb: "Build",
    title: "Building Construction",
    summary:
      "Disciplined site management, safe working practice and attention to finish, from foundations to handover.",
    points: ["Modern apartments, department stores and offices", "Site safety and supervision", "Quality control through to handover"],
  },
] as const;

export const values = [
  { title: "Quality", text: "Work we are prepared to put our name to, checked at every stage." },
  { title: "Timely delivery", text: "Realistic programmes, honest updates and a team that plans ahead." },
  { title: "Safe working environments", text: "Safety is part of how every site is set up and run." },
  { title: "Environmental responsibility", text: "Thoughtful materials, waste and site practice that respect the place we build." },
] as const;

// Seniority groups for staff profiles on the About page, in display order.
export const staffRanks = ["Leadership", "Management", "Senior staff", "Staff", "Trainee / intern"] as const;
export type StaffRank = (typeof staffRanks)[number];

export const projectCategories = ["Residential", "Commercial", "Institutional"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number | null;
  summary: string;
  body: string;
  client: string | null;
  scope: string | null;
  image_urls: string[];
  is_placeholder: boolean;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  /** Visitor rating summary; absent until the project has at least one rating. */
  rating?: Rating;
};

export type Rating = { average: number; total: number };

// GBC's projects, shown when the database has no published projects yet
// (supabase/seed.sql inserts the same records). Details beyond name, type and
// location are left for GBC to add from the dashboard rather than invented here.
const project = (slug: string, title: string, category: string, image: string, summary: string): Project => ({
  slug,
  title,
  category,
  location: "Cape Coast, Ghana",
  year: null,
  summary,
  body: summary,
  client: null,
  scope: null,
  image_urls: [image],
  is_placeholder: false,
  featured: true,
  latitude: null,
  longitude: null,
});

export const fallbackProjects: Project[] = [
  project("the-ridge-residences", "The Ridge Residences", "Residential", "/images/gbc/residential.jpg",
    "A residential project by Green-Building Creations Ltd. in Cape Coast, Ghana."),
  project("harbour-view-office-complex", "Harbour View Office Complex", "Commercial", "/images/gbc/commercial.jpg",
    "A commercial office project by Green-Building Creations Ltd. in Cape Coast, Ghana."),
  project("gbc-training-centre", "GBC Training Centre", "Institutional", "/images/gbc/institutional.jpg",
    "An institutional project by Green-Building Creations Ltd. in Cape Coast, Ghana."),
];

// Keys editable from the dashboard (table: site_content). Values here are the defaults.
export const editableContent = {
  "home.hero.eyebrow": "Sustainable spaces. Lasting impact.",
  "home.hero.title": "We Plan. We Design. We Build.",
  "home.hero.subtitle":
    "Planning, architectural design and building construction from Cape Coast, Ghana, delivered with care for quality, safety and the environment.",
  "home.about.title": "Building a greener, smarter tomorrow.",
  "home.intro":
    "Green-Building Creations Ltd. is a nature-inclusive design and build firm in Cape Coast, Ghana, committed to sustainable, innovative and high-quality building solutions. We create spaces that respect the environment, enhance communities and stand the test of time.",
  "home.locations":
    "Our projects are located across Cape Coast and surrounding areas, creating sustainable spaces that support local communities and the environment.",
  "home.careers":
    "We're always looking for passionate people who want to make a difference in sustainable construction and design.",
  "about.story":
    "Green-Building Creations Ltd. (GBC) is based in Cape Coast, in Ghana's Central Region. We bring planning, architectural design and building construction under one roof, from modern apartments to department stores and offices, so clients deal with one accountable team from the first sketch to handover. We work to deliver quality on time, within safe working environments.",
  "sustainability.intro":
    "Our work, and how we work, contribute to a sustainable future for our people, our clients and society. Building responsibly means considering the site, the materials and the people who will use the building long after we leave.",
} as const;

export type ContentKey = keyof typeof editableContent;

// Announcements, managed from Dashboard → Announcements (stored as a JSON list in site_content under
// the key below). Visitors open them from the megaphone badge in the header. Empty by default: nothing
// is shown until a manager publishes one.
export const ANNOUNCEMENTS_KEY = "announcements";
export type AnnouncementItem = {
  id: string;
  enabled: boolean;
  title: string;
  message: string;
  link_label: string;
  link_url: string;
  date: string; // shown on the announcement (YYYY-MM-DD)
  ends_on: string; // optional: hidden after this day
};
/** What visitors see. */
export type Announcement = Omit<AnnouncementItem, "enabled" | "ends_on">;

export const enquiryOptions = {
  services: ["Planning", "Architectural design", "Building construction", "Design and build", "Not sure yet"],
  projectTypes: ["House / residential", "Apartments", "Commercial / office", "School / institutional", "Retail / department store", "Renovation / extension", "Other"],
  budgets: ["Under GH₵ 250,000", "GH₵ 250,000 – 1,000,000", "GH₵ 1,000,000 – 5,000,000", "Above GH₵ 5,000,000", "Not decided"],
  timelines: ["As soon as possible", "Within 3 months", "3 – 6 months", "6 – 12 months", "Just exploring"],
} as const;

export const statusLabels: Record<string, string> = {
  new: "New enquiry",
  contacted: "Contacted",
  consultation: "Consultation",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};
export const statusOrder = ["new", "contacted", "consultation", "proposal", "won", "lost"] as const;
