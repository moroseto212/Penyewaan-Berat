-- =============================================================================
-- Setup admin tunggal: admin123@gmail.com (password: admin123)
--
-- Langkah:
--   1. Supabase Dashboard -> Authentication -> Users -> Add user
--        Email:    admin123@gmail.com
--        Password: admin123
--        Centang "Auto Confirm User"
--   2. Jalankan SQL ini di SQL Editor.
--
-- Catatan:
--   - Password tidak bisa di-set lewat SQL; hanya lewat dashboard (atau
--     Admin API dengan service_role key).
--   - Aplikasi juga membatasi login lewat env ADMIN_EMAIL=admin123@gmail.com
--     sehingga akun lain tidak akan bisa masuk walau baris admin_users ada.
-- =============================================================================

insert into public.admin_users (id, email, name, is_admin)
select id, email, 'Admin', true
from auth.users
where lower(email) = 'admin123@gmail.com'
on conflict (id) do update set is_admin = true;
