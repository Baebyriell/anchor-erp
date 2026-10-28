-- Each ERP spreadsheet (customers, sales ledger, pre-orders, ...) stored per user.
create table public.sheets (
  owner_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sheet_key  text not null check (sheet_key in (
    'customers', 'sales_ledger', 'preorder_by_item', 'preorder_by_customer',
    'items_preorder', 'items_available', 'pricing_preorder', 'pricing_available',
    'customer_matrix'
  )),
  headers    jsonb check (headers is null or jsonb_typeof(headers) = 'array'),
  rows       jsonb not null default '[]'::jsonb check (jsonb_typeof(rows) = 'array'),
  updated_at timestamptz not null default now(),
  primary key (owner_id, sheet_key),
  constraint sheets_size_limit check (pg_column_size(rows) < 2000000)
);

alter table public.sheets enable row level security;

create policy "Users read their own sheets" on public.sheets
  for select to authenticated using ((select auth.uid()) = owner_id);
create policy "Users insert their own sheets" on public.sheets
  for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "Users update their own sheets" on public.sheets
  for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Users delete their own sheets" on public.sheets
  for delete to authenticated using ((select auth.uid()) = owner_id);

-- Explicit grants, so this works when "Automatically expose new tables" is off.
revoke all on public.sheets from anon, authenticated;
grant select, insert, update, delete on public.sheets to authenticated;

-- Per-user request counter used to rate-limit server actions.
create table public.rate_limits (
  user_id      uuid not null references auth.users (id) on delete cascade,
  window_start timestamptz not null,
  hits         integer not null default 0,
  primary key (user_id, window_start)
);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- Returns true if the current user is under max_hits for the current window.
create or replace function public.check_rate_limit(max_hits integer, window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  bucket timestamptz := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);
  current_hits integer;
begin
  if uid is null then
    return false;
  end if;
  insert into public.rate_limits (user_id, window_start, hits)
  values (uid, bucket, 1)
  on conflict (user_id, window_start) do update set hits = public.rate_limits.hits + 1
  returning hits into current_hits;
  delete from public.rate_limits where user_id = uid and window_start < bucket - interval '1 day';
  return current_hits <= max_hits;
end;
$$;

revoke all on function public.check_rate_limit(integer, integer) from public, anon;
grant execute on function public.check_rate_limit(integer, integer) to authenticated;
