-- Categoria do item do portfólio: "project" (projeto com galeria) ou "tool"
-- (ferramenta open source, exibida numa seção própria e sem capa obrigatória).
alter table public.portfolio_projects
  add column if not exists category text not null default 'project';

alter table public.portfolio_projects
  drop constraint if exists portfolio_projects_category_check;

alter table public.portfolio_projects
  add constraint portfolio_projects_category_check check (category in ('project', 'tool'));
