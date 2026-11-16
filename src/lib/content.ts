// Static, approved site copy and fallback data.
// Public project descriptions are limited to facts that GBC or its associates have made public.
// Generic category imagery is labelled as illustrative; it is not represented as GBC site photography.

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
  /** Publicly supported description of the record's status; not a construction-stage claim. */
  portfolioStatus?: string;
  /** Disclosure displayed whenever the category image is not a project photograph. */
  imageNote?: string;
  /** Public source supporting the project or portfolio reference. */
  sourceUrl?: string;
};

export type Rating = { average: number; total: number };

const illustrativeImageNote = "Illustrative visual — not a photograph of this project.";

const project = (
  slug: string,
  title: string,
  category: string,
  location: string,
  image: string,
  summary: string,
  body: string,
  portfolioStatus: string,
  scope: string,
  sourceUrl: string,
): Project => ({
  slug,
  title,
  category,
  location,
  year: null,
  summary,
  body,
  client: null,
  scope,
  image_urls: [image],
  is_placeholder: false,
  featured: true,
  latitude: null,
  longitude: null,
  portfolioStatus,
  imageNote: illustrativeImageNote,
  sourceUrl,
});

// Documented references and broad experience statements.
// The first two entries are specific public references; the remaining entries reflect GBC's own
// company profile, which confirms these building types but does not publish project names or addresses.
export const fallbackProjects: Project[] = [
  project(
    "three-bedroom-residential-house",
    "Three-Bedroom Residential House",
    "Residential",
    "Cape Coast, Ghana",
    "/images/gbc/residential.jpg",
    "A three-bedroom plan is recorded as built in Cape Coast. A former GBC intern's public work history describes a structural drawing contribution and construction-site supervision during their placement.",
    "A former GBC intern's public professional profile records that a three-bedroom residential plan was built in Cape Coast. The same work-history entry says the intern proposed a structural drawing and supported construction supervision, measurement checks and site safety during a June–July 2024 placement at Green Building Creations.\n\nThis listing is limited to the contribution described in that public profile. The client, exact site, project date and full contractual scope have not been publicly identified.",
    "Built · contribution documented",
    "Structural drawing contribution; construction supervision; measurement and safety checks, as publicly described.",
    "https://himalayas.app/@felixamnkwahkwasi",
  ),
  project(
    "50-room-student-hostel-ucc",
    "50-Room Student Hostel Project",
    "Institutional",
    "University of Cape Coast, Cape Coast, Ghana",
    "/images/gbc/institutional.jpg",
    "A five-storey, 50-room hostel project brief for the University of Cape Coast, publicly shared by GBC's founder. The post describes the site constraints and design approach, but does not confirm construction or handover.",
    "GBC's founder publicly shared a project description for a 50-room hostel at the University of Cape Coast. The brief describes a 70 × 80 ft site (about 520 m²), five storeys with ten rooms per floor, an east–west orientation, passive cross-ventilation and acoustic measures responding to nearby road conditions.\n\nThe same public post outlines a hybrid pad-and-raft foundation approach and damp-protection measures for the coastal ground conditions. It is presented here as a published project brief. The available post does not establish that construction was completed or that the building was handed over.",
    "Project brief · build status unconfirmed",
    "Five-storey / 50-room brief; site planning, massing, ventilation, acoustic response and foundation strategy, as described in the public post.",
    "https://gh.linkedin.com/in/dr-gideon-charles-mensah-a33b77121",
  ),
  project(
    "modern-apartment-portfolio",
    "Modern Apartment Developments",
    "Residential",
    "Individual project locations not publicly disclosed",
    "/images/gbc/residential.jpg",
    "GBC's public company profile states that the firm has built modern apartments. Individual project names, clients, sites and completion dates are not itemised in the public profile.",
    "GBC's company profile describes modern apartments among the building types delivered by the firm. The public material does not identify individual apartment developments, client names, addresses, project dates or completion details. This entry therefore records the company's stated area of experience rather than inventing a project name.",
    "Company-stated portfolio experience",
    "Modern apartment development experience; individual project records are not publicly itemised.",
    "https://gh.linkedin.com/company/green-building-creations",
  ),
  project(
    "department-store-portfolio",
    "Department Store Projects",
    "Commercial",
    "Individual project locations not publicly disclosed",
    "/images/gbc/commercial.jpg",
    "GBC's public company profile lists department stores among the building types delivered by the firm. Individual project names, clients, sites and completion dates are not itemised publicly.",
    "GBC's company profile states that the firm has built department stores. The public company information does not provide individual project names, client details, addresses, dates or a breakdown of the work carried out. This entry is a transparent summary of the company's stated commercial experience, not a named case study.",
    "Company-stated portfolio experience",
    "Department-store / retail building experience; individual project records are not publicly itemised.",
    "https://gh.linkedin.com/company/green-building-creations",
  ),
  project(
    "office-development-portfolio",
    "Office Developments",
    "Commercial",
    "Individual project locations not publicly disclosed",
    "/images/gbc/commercial.jpg",
    "GBC's public company profile lists offices among the building types delivered by the firm. Individual project names, clients, sites and completion dates are not itemised publicly.",
    "GBC's company profile states that the firm has built offices. The public company information does not identify individual office projects, clients, addresses, dates or project-specific scope. This entry is a summary of the company's stated experience, not a named case study.",
    "Company-stated portfolio experience",
    "Office-building experience; individual project records are not publicly itemised.",
    "https://gh.linkedin.com/company/green-building-creations",
  ),
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
    "Two specific public project references in this portfolio are associated with Cape Coast. We show city-level map pins only where a source gives a location, and leave projects without a published site address off the map.",
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
