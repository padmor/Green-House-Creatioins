import type { Person } from "./data";

// SAMPLE PROFILES: placeholders, not real GBC staff. The names are invented, the pictures are
// illustrations (public/images/team/sample-*.svg), and the qualifications, duties and contributions
// are typical examples for each role, not anyone's real record. They show on the About page only
// while no real profiles are published from Dashboard → Founder & team; every card and profile is
// badged "Sample" and the handles are not links.
type Extra = Pick<Person, "qualifications" | "responsibilities" | "contributions">;
const lines = (...items: string[]) => items.join("\n");
const handle = (slug: string) => ({
  linkedin_url: `https://www.linkedin.com/in/${slug}`,
  x_url: `https://x.com/${slug}`,
  instagram_url: null,
  facebook_url: null,
  public_email: `${slug}@example.com`,
});

const sample = (n: number, full_name: string, role_title: string, rank: Person["rank"], bio: string, extra: Extra, slug: string): Person => ({
  id: `sample-${n}`,
  full_name,
  role_title,
  rank,
  bio,
  photo_url: `/images/team/sample-${n}.svg`,
  ...handle(slug),
  ...extra,
  is_founder: false,
  sample: true,
});

export const sampleTeam: Person[] = [
  sample(1, "Kwame Asante", "Managing Director", "Leadership",
    "Sample profile. The managing director leads the company and oversees planning, design and construction from the first meeting to handover.",
    {
      qualifications: lines("Example: MSc Construction Management", "Example: BSc Civil Engineering"),
      responsibilities: lines("Sets company direction and standards", "Leads client relationships on major projects", "Oversees safety and quality across all sites"),
      contributions: lines("Example: introduced a site safety induction for every project", "Example: led the move to one team for planning, design and build"),
    }, "sample-md"),
  sample(2, "Abena Owusu", "Head of Design", "Management",
    "Sample profile. The head of design leads the architectural team, shaping each building around how it will be used, the climate and the budget.",
    {
      qualifications: lines("Example: MArch Architecture", "Example: Member, Ghana Institute of Architects"),
      responsibilities: lines("Leads concept and detailed design", "Reviews drawings before construction", "Works with clients on layouts and materials"),
      contributions: lines("Example: set up the design review checklist", "Example: led the climate-responsive design approach"),
    }, "sample-design"),
  sample(3, "Kofi Mensah", "Senior Site Engineer", "Senior staff",
    "Sample profile. The senior site engineer runs day-to-day work on site, keeping it safe, on programme and built to the drawings.",
    {
      qualifications: lines("Example: BSc Civil Engineering", "Example: Site safety certificate"),
      responsibilities: lines("Plans and supervises daily site work", "Checks work against the drawings", "Runs toolbox talks and safety checks"),
      contributions: lines("Example: introduced weekly progress photos for clients"),
    }, "sample-site"),
  sample(4, "Akosua Boateng", "Site Engineer", "Staff",
    "Sample profile. Site engineers set out the works, check quality at each stage and keep the site team coordinated.",
    {
      qualifications: lines("Example: BSc Building Technology"),
      responsibilities: lines("Sets out the works on site", "Inspects quality at each stage", "Keeps site records up to date"),
      contributions: lines("Example: improved the materials delivery log"),
    }, "sample-engineer"),
  sample(5, "Yaw Darko", "Quantity Surveyor", "Staff",
    "Sample profile. The quantity surveyor prepares estimates, tracks costs and helps clients keep their project within budget.",
    {
      qualifications: lines("Example: BSc Quantity Surveying"),
      responsibilities: lines("Prepares estimates and bills of quantities", "Tracks costs during construction", "Values work for payments"),
      contributions: lines("Example: created the standard cost report clients receive"),
    }, "sample-qs"),
  sample(6, "Efua Addo", "Architectural Intern", "Trainee / intern",
    "Sample profile. Interns support the design team with drawings and site visits while they train.",
    {
      qualifications: lines("Example: Studying BSc Architecture"),
      responsibilities: lines("Prepares drawings with the design team", "Joins site visits to learn construction"),
      contributions: lines("Example: helped build the project drawing library"),
    }, "sample-intern"),
];
