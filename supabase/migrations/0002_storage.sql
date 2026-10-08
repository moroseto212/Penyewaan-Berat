-- =============================================================================
-- Supabase Storage: bucket gambar + kebijakan akses
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
    ('equipment',    'equipment',    true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('projects',     'projects',     true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('blog',         'blog',         true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('categories',   'categories',   true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('service-areas','service-areas',true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('services',     'services',     true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('testimonials', 'testimonials', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

-- Semua bucket bersifat publik untuk dibaca (agar <Image> / <img> bisa.src langsung)
create policy "storage_public_read"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id in (
        'equipment', 'projects', 'blog', 'categories',
        'service-areas', 'services', 'testimonials'
    ));

-- Hanya admin yang boleh upload / hapus
create policy "storage_admin_insert"
    on storage.objects for insert
    to authenticated
    with check (public.is_admin());

create policy "storage_admin_update"
    on storage.objects for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "storage_admin_delete"
    on storage.objects for delete
    to authenticated
    using (public.is_admin());
