-- Create expenses table
create table if not exists public.expenses (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  merchant            text not null,
  amount              numeric not null,
  currency            text not null default 'USD',
  expense_date        date not null,
  expense_time        time without time zone,
  notes               text,
  receipt_image_path  text,
  source              text not null check (source in ('scan', 'manual')),
  ai_provider         text,
  ai_model            text,
  ai_confidence       numeric,
  raw_ai_result       jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Index for common queries
create index if not exists expenses_user_id_expense_date_idx
  on public.expenses (user_id, expense_date desc);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

-- Row-level security
alter table public.expenses enable row level security;

create policy "Users can select own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Storage bucket for receipts
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Storage RLS: users can only access their own receipts (stored under user_id/ prefix)
create policy "Users can upload own receipts"
  on storage.objects for insert
  with check (
    bucket_id = 'receipts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read own receipts"
  on storage.objects for select
  using (
    bucket_id = 'receipts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own receipts"
  on storage.objects for update
  using (
    bucket_id = 'receipts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own receipts"
  on storage.objects for delete
  using (
    bucket_id = 'receipts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
