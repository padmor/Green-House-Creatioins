# Green-Building Creations Ltd. website

Next.js 16 (App Router) + Supabase + Resend, intended for Vercel.

## Setup

1. `npm install --include=dev` (use `--include=dev` if your shell sets `NODE_ENV=production`).
2. Create a Supabase project, then run [supabase/schema.sql](supabase/schema.sql) in the SQL editor.
3. Copy `.env.example` to `.env.local` and fill it in. `SUPABASE_SERVICE_ROLE_KEY` is server-only.
4. In Supabase → Authentication → Users, add your own account first: the **first** user becomes `admin`.
   Later accounts are created inactive; an admin activates them and sets a role under Dashboard → Team.
5. `npm run dev`, then open http://localhost:3000 and http://localhost:3000/login.

## Roles

| Role | Enquiries | Assign | Portfolio & content | Team |
| --- | --- | --- | --- | --- |
| admin | all | yes | yes | yes |
| manager | all | yes | yes | no |
| staff | assigned to them only | no | no | no |
| editor | none | no | yes | no |

Enforced twice: in server actions ([src/lib/auth.ts](src/lib/auth.ts)) and by Postgres row-level security.

## Security notes

- Public enquiries are written only by a server action using the service-role key; there is no anonymous insert policy.
- The enquiry form has validation (zod), a honeypot and a best-effort in-memory throttle. Add a WAF/edge rate limit before heavy traffic.
- Email is best-effort: the enquiry is saved first, so a mail failure never loses it.

## Content that is NOT genuine yet

- Contact email/phone fall back to obvious placeholders until the env vars are set.
- Portfolio shows labelled placeholder projects until a real project is published.
- No team, certifications, testimonials or achievements are claimed. Add them only once verified.
- Replace the line-art placeholder imagery with real GBC photography (set image URLs on projects).
