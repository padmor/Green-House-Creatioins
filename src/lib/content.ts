// Static, approved site copy and fallback data.
// Public project descriptions are limited to facts that GBC or its associates have made public.
// Generic category imagery is labelled as illustrative; it is not represented as GBC site photography.

export const company = {
  name: "Green-Building Creations Ltd.",
  short: "GBC",
  tagline: "Find skilled hands. Get the job done.",
  city: "Cape Coast",
  country: "Ghana",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@gbcghana.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+233 24 123 4567",
  // WhatsApp number in international format, digits only (e.g. 233241234567). Not set = no WhatsApp button.
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.replace(/\D/g, "") || undefined,
  region: "Central Region",
  address: "Cape Coast, Central Region, Ghana",
  postal: "P. O. Box UC 23, Cape Coast, Ghana",
  industry: "Trade Services & Job Matching",
  positioning: "A job-matching service for skilled tradespeople",
  sustainability:
    "We support safer worksites, clear job scopes and responsible work practices by connecting clients with skilled trade professionals.",
  // Map centre / office pin (Cape Coast).
  coords: [5.1053, -1.2466] as [number, number],
  mission:
    "To make it easier for customers to find skilled tradespeople and for qualified professionals to access genuine work opportunities.",
};

// Social links appear in the footer only when configured.
export const social = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN, icon: "linkedin" },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, icon: "instagram" },
  { label: "Facebook", href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, icon: "facebook" },
].filter((s): s is { label: string; href: string; icon: string } => Boolean(s.href));

export const nav = [
  { href: "/about", label: "How it works" },
  { href: "/projects", label: "Find a trade" },
  { href: "/map", label: "Trust & verification" },
  { href: "/contact", label: "Post a job" },
] as const;

export const footerNav = [
  ...nav,
  { href: "/careers", label: "Join as a tradesperson" },
  { href: "/sustainability", label: "Worksite standards" },
] as const;

export const services = [
  {
    slug: "tiler",
    verb: "Tile",
    title: "Tilers",
    summary: "Find skilled tilers for floor and wall tiling, bathrooms, kitchens, repairs and finishing work.",
    points: ["Floor and wall installation", "Bathroom and kitchen tiling", "Regrouting and tile repairs"],
  },
  {
    slug: "electrician",
    verb: "Wire",
    title: "Electricians",
    summary: "Connect with electricians for installation, repairs, lighting and electrical maintenance. Indoor wiring requests are referred only to professionals whose CEWP status is verified.",
    points: ["Lighting and fixture installation", "Fault finding and repairs", "Certified indoor wiring work"],
  },
  {
    slug: "plumber",
    verb: "Fix",
    title: "Plumbers",
    summary: "Get help with pipework, taps, drainage, bathrooms, water systems and plumbing repairs.",
    points: ["Pipe and fitting installation", "Leaks and drainage repairs", "Bathroom and water-system work"],
  },
  {
    slug: "carpenter",
    verb: "Craft",
    title: "Carpenters",
    summary: "Find carpenters for doors, roofing timber, cabinetry, furniture, fittings and woodwork repairs.",
    points: ["Doors, frames and fittings", "Cabinetry and furniture", "Roof and general woodwork"],
  },
  {
    slug: "mason",
    verb: "Build",
    title: "Masons",
    summary: "Connect with masons for block laying, plastering, screeding, concrete work and masonry repairs.",
    points: ["Block laying and plastering", "Concrete and screeding", "Masonry repairs and alterations"],
  },
] as const;

export const tradeCategories = [
  { slug: "tiler", name: "Tilers", singular: "Tiler", summary: "Floor and wall tiling, bathrooms, kitchens, regrouting and tile repairs.", image: "/images/gbc/residential.jpg" },
  { slug: "electrician", name: "Electricians", singular: "Electrician", summary: "Lighting, installations, fault finding and electrical maintenance.", image: "/images/gbc/commercial.jpg" },
  { slug: "plumber", name: "Plumbers", singular: "Plumber", summary: "Pipework, taps, drainage, water systems and plumbing repairs.", image: "/images/gbc/institutional.jpg" },
  { slug: "carpenter", name: "Carpenters", singular: "Carpenter", summary: "Doors, cabinets, furniture, roofing timber and woodwork repairs.", image: "/images/gbc/residential.jpg" },
  { slug: "mason", name: "Masons", singular: "Mason", summary: "Block laying, plastering, screeding, concrete and masonry repairs.", image: "/images/gbc/institutional.jpg" },
] as const;

export type TradeName = (typeof tradeCategories)[number]["singular"];
export type VerifiedTradesperson = {
  id: string;
  public_name: string;
  trade: TradeName;
  service_area: string;
  experience_years: number;
  bio: string;
  portfolio_url: string | null;
};

export const values = [
  { title: "Verified skills", text: "Trade credentials, identity, references and work evidence are reviewed before a professional is listed as verified." },
  { title: "Clear job details", text: "Customers describe the work, location, timing and budget so professionals can respond with relevant quotes." },
  { title: "Safer work", text: "Safety and trade-specific requirements matter. Electrical wiring work is matched only with appropriately certified professionals." },
  { title: "Accountability", text: "Job requests, follow-ups and agreed next steps are recorded so customers know what happens next." },
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
    "A former GBC intern's public professional profile records that a three-bedroom residential plan was built in Cape Coast. The same work-history entry says the intern proposed a structural drawing and supported construction supervision, measurement checks and site safety during a June–July 2024 internship at Green Building Creations.\n\nThis listing is limited to the contribution described in that public profile. The client, exact site, project date and full contractual scope have not been publicly identified.",
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
  "home.hero.eyebrow": "Your job. The right professional.",
  "home.hero.title": "Find the right hands for the job.",
  "home.hero.subtitle":
    "Find tilers, electricians, plumbers, carpenters and masons. Post a job, get connected with a suitable professional and keep track of the work.",
  "home.about.title": "Skilled trades. Clear requests. Better job connections.",
  "home.intro":
    "Green-Building Creations Ltd. is developing a job-matching service that helps customers find skilled tradespeople and helps professionals access genuine work. Profiles are published as verified only after the required checks have been completed.",
  "home.locations":
    "GBC is based in Cape Coast. Job requests can be submitted with the work location, and availability is confirmed with the customer before a professional is matched.",
  "home.careers":
    "Are you a tiler, electrician, plumber, carpenter or mason? Apply to join the network. Your profile will be reviewed before it can appear as verified.",
  "about.story":
    "Green-Building Creations Ltd. (GBC) is based in Cape Coast, Ghana. We are shifting the website from a building portfolio into a job-matching service for customers who need skilled trade work and professionals looking for genuine jobs. Customers can post a job request, share the location and requirements, and receive follow-up from the GBC team. Tradespeople apply to join the network and are reviewed before a verified profile is published.",
  "sustainability.intro":
    "A dependable job site begins with clear scopes, safe work practices and transparent expectations. We review trade evidence before listing a professional as verified and keep electrical wiring requests subject to the relevant certification checks.",
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
  services: ["Tiler", "Electrician", "Plumber", "Carpenter", "Mason", "Other trade"],
  projectTypes: ["Installation", "Repair", "Renovation", "Maintenance", "Emergency work", "Other"],
  budgets: ["Need an estimate", "Labour only", "Labour and materials", "I have a fixed budget", "Discuss with me"],
  timelines: ["Urgent — as soon as possible", "Within 2–3 days", "This week", "Within 2 weeks", "Flexible"],
} as const;

export const statusLabels: Record<string, string> = {
  new: "New job request",
  contacted: "Customer contacted",
  consultation: "Requirements being checked",
  proposal: "Quote shared",
  won: "Professional hired",
  lost: "Closed / not proceeding",
};
export const statusOrder = ["new", "contacted", "consultation", "proposal", "won", "lost"] as const;
