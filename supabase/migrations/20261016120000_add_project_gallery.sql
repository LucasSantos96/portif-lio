-- Colunas que o schema do Prisma espera e que ainda não existiam no banco:
-- traduções (title_en/description_en) e galeria de fotos + vídeos do YouTube.
alter table public.portfolio_projects
  add column if not exists title_en text,
  add column if not exists description_en text,
  add column if not exists gallery_images text[] not null default '{}',
  add column if not exists video_urls text[] not null default '{}';
