-- ユーザー登録時にProfileを作成するトリガー関数
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."Profile" (id, name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

-- トリガーの作成
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
