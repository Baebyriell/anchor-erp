-- "Test as another user": proves Row Level Security keeps each account's data private.
-- Run in the Supabase SQL Editor. Everything happens inside a transaction that is
-- rolled back, so no test users or rows are left behind.
-- Expected output: every check says PASS.

begin;

-- Two throwaway users
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'rls-test-a@example.invalid'),
  ('00000000-0000-0000-0000-00000000000b', 'rls-test-b@example.invalid');

-- User A saves a sheet
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);
insert into public.sheets (owner_id, sheet_key, rows)
values ('00000000-0000-0000-0000-00000000000a', 'customers', '[{"Full Name":"Secret Customer"}]');

-- User B tries to read, change, delete and impersonate A
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);

select case when count(*) = 0 then 'PASS' else 'FAIL' end as "B cannot read A's rows"
from public.sheets where owner_id = '00000000-0000-0000-0000-00000000000a';

with changed as (
  update public.sheets set rows = '[]' where owner_id = '00000000-0000-0000-0000-00000000000a' returning 1
)
select case when count(*) = 0 then 'PASS' else 'FAIL' end as "B cannot change A's rows" from changed;

with removed as (
  delete from public.sheets where owner_id = '00000000-0000-0000-0000-00000000000a' returning 1
)
select case when count(*) = 0 then 'PASS' else 'FAIL' end as "B cannot delete A's rows" from removed;

do $$
begin
  insert into public.sheets (owner_id, sheet_key, rows)
  values ('00000000-0000-0000-0000-00000000000a', 'sales_ledger', '[]');
  raise notice 'FAIL: B could write rows as A';
exception when insufficient_privilege or check_violation then
  raise notice 'PASS: B cannot write rows as A';
end $$;

-- Signed-out visitors (anon key only) see nothing
reset role;
set local role anon;
select case when has_table_privilege('anon', 'public.sheets', 'select') then 'FAIL' else 'PASS' end
  as "Signed-out visitors cannot read sheets";

rollback;
