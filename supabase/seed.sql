-- Publicly documented GBC project references and stated portfolio experience.
-- Run after schema.sql. These entries contain no invented clients, dates or addresses.
-- Generic category images are explicitly disclosed as illustrative by the website UI.
insert into projects (slug, title, category, location, summary, body, image_urls, is_placeholder, featured, published)
values
  (
    'three-bedroom-residential-house',
    'Three-Bedroom Residential House',
    'Residential',
    'Cape Coast, Ghana',
    'A three-bedroom plan is recorded as built in Cape Coast. A former GBC intern''s public work history describes a structural drawing contribution and construction-site supervision during their placement.',
    'A former GBC intern''s public professional profile records that a three-bedroom residential plan was built in Cape Coast. The same work-history entry says the intern proposed a structural drawing and supported construction supervision, measurement checks and site safety during a June–July 2024 placement at Green Building Creations.\n\nThis listing is limited to the contribution described in that public profile. The client, exact site, project date and full contractual scope have not been publicly identified.',
    array['/images/gbc/residential.jpg'], false, true, true
  ),
  (
    '50-room-student-hostel-ucc',
    '50-Room Student Hostel Project',
    'Institutional',
    'University of Cape Coast, Cape Coast, Ghana',
    'A five-storey, 50-room hostel project brief for the University of Cape Coast, publicly shared by GBC''s founder. The post describes the site constraints and design approach, but does not confirm construction or handover.',
    'GBC''s founder publicly shared a project description for a 50-room hostel at the University of Cape Coast. The brief describes a 70 × 80 ft site (about 520 m²), five storeys with ten rooms per floor, an east–west orientation, passive cross-ventilation and acoustic measures responding to nearby road conditions.\n\nThe same public post outlines a hybrid pad-and-raft foundation approach and damp-protection measures for the coastal ground conditions. It is presented here as a published project brief. The available post does not establish that construction was completed or that the building was handed over.',
    array['/images/gbc/institutional.jpg'], false, true, true
  ),
  (
    'modern-apartment-portfolio',
    'Modern Apartment Developments',
    'Residential',
    'Individual project locations not publicly disclosed',
    'GBC''s public company profile states that the firm has built modern apartments. Individual project names, clients, sites and completion dates are not itemised in the public profile.',
    'GBC''s company profile describes modern apartments among the building types delivered by the firm. The public material does not identify individual apartment developments, client names, addresses, project dates or completion details. This entry therefore records the company''s stated area of experience rather than inventing a project name.',
    array['/images/gbc/residential.jpg'], false, true, true
  ),
  (
    'department-store-portfolio',
    'Department Store Projects',
    'Commercial',
    'Individual project locations not publicly disclosed',
    'GBC''s public company profile lists department stores among the building types delivered by the firm. Individual project names, clients, sites and completion dates are not itemised publicly.',
    'GBC''s company profile states that the firm has built department stores. The public company information does not provide individual project names, client details, addresses, dates or a breakdown of the work carried out. This entry is a transparent summary of the company''s stated commercial experience, not a named case study.',
    array['/images/gbc/commercial.jpg'], false, true, true
  ),
  (
    'office-development-portfolio',
    'Office Developments',
    'Commercial',
    'Individual project locations not publicly disclosed',
    'GBC''s public company profile lists offices among the building types delivered by the firm. Individual project names, clients, sites and completion dates are not itemised publicly.',
    'GBC''s company profile states that the firm has built offices. The public company information does not identify individual office projects, clients, addresses, dates or project-specific scope. This entry is a summary of the company''s stated experience, not a named case study.',
    array['/images/gbc/commercial.jpg'], false, true, true
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  location = excluded.location,
  summary = excluded.summary,
  body = excluded.body,
  image_urls = excluded.image_urls,
  is_placeholder = excluded.is_placeholder,
  featured = excluded.featured,
  published = excluded.published;
