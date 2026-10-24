import { z } from "zod";
import { enquiryOptions, staffRanks } from "./content";

const clean = (max: number) => z.string().trim().max(max);
const coord = (min: number, max: number) =>
  z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().min(min).max(max).nullable());

export const enquirySchema = z.object({
  name: clean(120).min(2, "Please enter your name."),
  email: clean(254).pipe(z.email("Please enter a valid email address.")),
  phone: z
    .union([z.literal(""), clean(30).regex(/^[+\d][\d\s()\-]{5,}$/, "Please enter a valid phone number.")])
    .optional()
    .default(""),
  organisation: clean(120).optional().default(""),
  service: z.enum(enquiryOptions.services, { error: "Please choose a service." }),
  project_type: z.enum(enquiryOptions.projectTypes, { error: "Please choose a project type." }),
  location: clean(160).min(2, "Please tell us where the project is."),
  budget_range: z.enum(enquiryOptions.budgets).optional().or(z.literal("")),
  timeline: z.enum(enquiryOptions.timelines).optional().or(z.literal("")),
  message: clean(4000).min(10, "Please describe your project in a few sentences."),
  consent: z.literal("on", { error: "Please confirm you agree to be contacted." }),
  website: z.string().max(0).optional().default(""), // honeypot
});

export const noteSchema = z.object({
  enquiry_id: z.uuid(),
  kind: z.enum(["note", "call", "email", "meeting"]),
  body: clean(4000).min(1, "Write something first."),
});

export const projectSchema = z.object({
  title: clean(160).min(2),
  slug: clean(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only."),
  category: clean(60).min(2),
  location: clean(160).min(2),
  year: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().min(1950).max(2100).nullable()),
  summary: clean(500).min(10),
  body: clean(10000).optional().default(""),
  client: clean(160).optional().default(""),
  scope: clean(300).optional().default(""),
  image_urls: clean(4000).optional().default(""), // one https URL (or /site path) per line
  latitude: coord(-90, 90),
  longitude: coord(-180, 180),
});

const announcementItemSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]{6,40}$/i),
    enabled: z.boolean(),
    title: clean(80).min(3, "Every announcement needs a title (at least 3 characters)."),
    message: clean(600).optional().default(""),
    link_label: clean(30).optional().default(""),
    link_url: z.union([z.literal(""), clean(500).regex(/^(https:\/\/|\/)\S*$/i, "Links must start with https:// or / (a page on this site).")]).optional().default(""),
    date: z.iso.date("Each announcement needs a valid date."),
    ends_on: z.union([z.literal(""), z.iso.date("Use a valid end date.")]).optional().default(""),
  })
  .refine((a) => !a.link_url || a.link_label, { message: "Add link text (e.g. Learn more) for each link." });

export const announcementsSchema = z.array(announcementItemSchema).max(12, "Keep it to 12 announcements or fewer.");

export const personSchema = z.object({
  full_name: clean(120).min(2, "Enter the person's full name."),
  role_title: clean(120).min(2, "Enter their role, e.g. Site Engineer."),
  rank: z.enum(staffRanks, { error: "Choose a rank." }),
  linkedin_url: z
    .union([z.literal(""), clean(300).regex(/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/\S+$/i, "Use a full LinkedIn link, e.g. https://www.linkedin.com/in/name")])
    .optional()
    .default(""),
  bio: clean(1500).optional().default(""),
  qualifications: clean(1500).optional().default(""),
  responsibilities: clean(1500).optional().default(""),
  contributions: clean(1500).optional().default(""),
  x_url: z.union([z.literal(""), clean(300).regex(/^https:\/\/(www\.)?(x|twitter)\.com\/\S+$/i, "Use a full X link, e.g. https://x.com/name")]).optional().default(""),
  instagram_url: z.union([z.literal(""), clean(300).regex(/^https:\/\/(www\.)?instagram\.com\/\S+$/i, "Use a full Instagram link, e.g. https://instagram.com/name")]).optional().default(""),
  facebook_url: z.union([z.literal(""), clean(300).regex(/^https:\/\/(www\.|m\.)?facebook\.com\/\S+$/i, "Use a full Facebook link, e.g. https://facebook.com/name")]).optional().default(""),
  public_email: z.union([z.literal(""), clean(254).pipe(z.email("Enter a valid work email."))]).optional().default(""),
  photo_url: z.union([z.literal(""), clean(1000).regex(/^(https:\/\/|\/)\S+$/i, "Photo URL must start with https:// or /")]).optional().default(""),
  sort_order: z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int().min(0).max(999)),
});
