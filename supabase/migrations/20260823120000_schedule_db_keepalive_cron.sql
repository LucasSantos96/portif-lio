-- Keeps the project from being auto-paused for inactivity on the Free Plan
-- (Supabase pauses Free Plan projects after ~7 days with no activity).
-- Runs a harmless read every 4 days, well inside that window.
create extension if not exists pg_cron;

select
  cron.schedule(
    'portfolio-db-keepalive',
    '0 3 */4 * *',
    $$ select count(*) from public.portfolio_projects; $$
  );
