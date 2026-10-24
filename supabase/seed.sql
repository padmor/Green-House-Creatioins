-- GBC projects shown on the website. Run after schema.sql. Safe to re-run.
-- Add descriptions, years, scope and map coordinates from the dashboard.
insert into projects (slug, title, category, location, summary, body, image_urls, is_placeholder, featured, published)
values
  ('the-ridge-residences', 'The Ridge Residences', 'Residential', 'Cape Coast, Ghana',
   'A residential project by Green-Building Creations Ltd. in Cape Coast, Ghana.',
   'A residential project by Green-Building Creations Ltd. in Cape Coast, Ghana.',
   array['/images/gbc/residential.jpg'], false, true, true),
  ('harbour-view-office-complex', 'Harbour View Office Complex', 'Commercial', 'Cape Coast, Ghana',
   'A commercial office project by Green-Building Creations Ltd. in Cape Coast, Ghana.',
   'A commercial office project by Green-Building Creations Ltd. in Cape Coast, Ghana.',
   array['/images/gbc/commercial.jpg'], false, true, true),
  ('gbc-training-centre', 'GBC Training Centre', 'Institutional', 'Cape Coast, Ghana',
   'An institutional project by Green-Building Creations Ltd. in Cape Coast, Ghana.',
   'An institutional project by Green-Building Creations Ltd. in Cape Coast, Ghana.',
   array['/images/gbc/institutional.jpg'], false, true, true)
on conflict (slug) do nothing;
