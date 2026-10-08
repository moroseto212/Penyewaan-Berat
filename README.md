# Alat Berat — Next.js + Supabase

Rewrite penuh website AlatBerat dari Laravel 12 (PHP) menjadi Next.js App Router +
Supabase, agar bisa dideploy ke Vercel tanpa server PHP.

Situs publik tetap sama (konten, layout, warna, Bahasa Indonesia), sedangkan panel
admin memakai Supabase Auth dan Row Level Security.

---

## 1. Teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Server Components + Server Actions) |
| UI | React 19, Tailwind CSS v4, Font Awesome |
| Database | Supabase Postgres |
| Auth | Supabase Auth (`@supabase/ssr`, cookie-based) |
| Media | Supabase Storage bucket publik |
| Deploy | Vercel |

## 2. Menjalankan secara lokal

```bash
npm install
# isi .env.local (sudah ada, ubah placeholder Supabase) — lihat bagian 3 & 4.0
npm run dev                  # http://localhost:3000
```

Script yang tersedia:

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi (termasuk type-check) |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | ESLint |

## 3. Environment variables

Salin `.env.example` menjadi `.env.local`, lalu isi:

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ya | Dashboard Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ya | Kunci **anon/public** (bukan service role) |
| `NEXT_PUBLIC_SITE_URL` | ya | URL situs, mis. `https://alatberat.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | tidak | Format angka tanpa `+`/spasi. Kosong → tombol WhatsApp disembunyikan |
| `NEXT_PUBLIC_CONTACT_PHONE` | tidak | Ditampilkan di halaman kontak |
| `NEXT_PUBLIC_CONTACT_EMAIL` | tidak | Ditampilkan di halaman kontak |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | tidak | Ditampilkan di halaman kontak |
| `NEXT_PUBLIC_CONTACT_HOURS` | tidak | Jam operasional |
| `ADMIN_EMAIL` | tidak | Satu-satunya email yang boleh login ke panel admin (mis. `admin123@gmail.com`). Dikosongkan → semua user di `admin_users` diizinkan. Hanya dibaca server. |

`service_role` key **tidak boleh** dipakai di aplikasi ini.

## 4. Setup Supabase

### 4.0 Buat project Supabase dari nol (belum punya akun)

1. Buka <https://supabase.com> → **Sign up** (bisa pakai GitHub / Google / email).
2. Klik **New project** → isi:
   - **Name**: `alat-berat` (bebas)
   - **Database password**: simpan password ini (untuk akses SQL nanti)
   - **Region**: `Southeast Asia (Singapore)` (terdekat dari Indonesia)
   - Tunggu provisioning ±1–2 menit.
3. Ambil kredensial: **Project Settings → API** → salin:
   - **Project URL** → tempel ke `NEXT_PUBLIC_SUPABASE_URL` di `.env.local`
   - **anon public** key → tempel ke `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`
4. Buka **SQL Editor → New query**, lalu jalankan berurutan isi file berikut
   (tempel seluruh isi file → klik **Run**):
   - **Cara termudah**: satu kali paste `supabase/setup-1_tabel_dan_data.sql`
     (gabungan ketiga file di bawah), **atau** jalankan satu per satu:
   1. `supabase/migrations/0001_init.sql`
   2. `supabase/migrations/0002_storage.sql`
   3. `supabase/data/import-laravel-content.sql` (data persis website asli)
      — **atau** `supabase/seed.sql` (data contoh) untuk pengembangan.
5. Buat akun admin (bagian 4.3 — email `admin123@gmail.com`, password `admin123`).
6. Jalankan `npm run dev`.

### 4.1 Migration

Jalankan berurutan dari SQL Editor (atau `supabase db push` bila memakai CLI):

1. `supabase/migrations/0001_init.sql` — 12 tabel, index, trigger `updated_at`,
   fungsi `public.is_admin()`, dan seluruh policy RLS.
2. `supabase/migrations/0002_storage.sql` — bucket Storage + policy akses.
3. `supabase/seed.sql` — data contoh (opsional, untuk pengembangan).
4. `supabase/data/import-laravel-content.sql` — data asli dari MySQL lama
   (lihat bagian 4.2). **Jangan** menjalankan `seed.sql` lebih dulu bila
   memakai file import ini karena slug-nya akan bentrok.

Bucket yang dibuat: `equipment`, `projects`, `blog`, `categories`, `service-areas`,
`services`, `testimonials`. Semua bucket public-read dan hanya bisa ditulis admin.

### 4.2 Import data asli dari MySQL

Data produksi lama ada di database MySQL `alat_berat`. Dump pernah dibuat di
`%TEMP%/alat_berat_dump.sql` dan dikonversi oleh
`scripts/import-laravel-data.py` menjadi SQL Postgres.

Regenerasi dump + konversi (jalankan dari folder `alat-berat-next`):

```bash
# 1. Dump (pastikan mysqld Laragon sudah jalan)
"C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqldump.exe" -u root ^
  --single-transaction --complete-insert --skip-add-drop-table ^
  --skip-extended-insert --default-character-set=utf8mb4 ^
  --routines=false --triggers=false alat_berat > "%TEMP%\alat_berat_dump.sql"

# 2. Konversi ke SQL Postgres
python scripts/import-laravel-data.py "%TEMP%\alat_berat_dump.sql"
```

Hasil konversi:

- `supabase/data/import-laravel-content.sql` — 75 baris (8 kategori, 5 layanan,
  10 area layanan, 5 testimoni, 11 equipment + 11 gambar, 5 proyek + 5 gambar,
  5 artikel, 10 FAQ, 0 kontak).
- `supabase/data/import-report.md` — rekap jumlah baris per tabel dan daftar host
  gambar eksternal.

Catatan penting:

- Jalankan **setelah** `0001_init.sql` dan `0002_storage.sql`.
- File dibungkus `begin;` / `commit;` dan memakai `on conflict (id) do nothing`,
  jadi aman dijalankan ulang.
- `id` asli dipertahankan agar foreign key konsisten, lalu identity sequence
  tiap tabel di-`setval` ke `max(id)`.
- Tabel `users` tidak diimpor; admin dibuat lewat Supabase Auth.
- Semua kolom gambar berisi URL host luar (17 domain), jadi tidak ada file yang
  perlu diunggah ke Storage. `next/image` sudah diizinkan untuk host https
  mana pun di `next.config.ts`.

### 4.3 Membuat admin (admin123@gmail.com)

`admin_users` sengaja **tidak** punya policy insert/update untuk client, supaya
peran admin tidak bisa diberikan sendiri lewat aplikasi. Pembatasan ganda:

- **Supabase Auth** — hanya akun yang dibuat di dashboard yang bisa login.
- **`ADMIN_EMAIL`** di `.env.local` = `admin123@gmail.com` — email lain ditolak
  oleh aplikasi saat login maupun saat membuka `/admin`, walau baris
  `admin_users`-nya ada.

Langkah:

1. Supabase Dashboard → Authentication → Users → **Add user**
   - Email: `admin123@gmail.com`
   - Password: `admin123`
   - Centang *Auto Confirm User*.
2. Jalankan `supabase/admin-setup.sql` di SQL Editor (memberi izin admin ke
   email tersebut — tidak perlu salin UUID).

Mengganti admin: ubah `ADMIN_EMAIL` di `.env.local` + buat akun baru di
dashboard, lalu jalankan ulang `admin-setup.sql` dengan email baru.

### 4.4 Ringkasan aturan akses

| Tabel | Anon (publik) | Admin |
| --- | --- | --- |
| `categories`, `services`, `service_areas`, `testimonials`, `faqs` | baca baris `is_active = true` | baca & tulis semua |
| `blog_posts` | baca yang `is_published` dan `published_at` terisi | baca & tulis semua |
| `projects` | baca yang `is_active = true` | baca & tulis semua |
| `equipment`, `equipment_images`, `project_images` | baca | baca & tulis semua |
| `contacts` | insert saja (form kontak publik) | baca, tandai dibaca, hapus |
| `admin_users` | tidak ada | baca semua |

## 5. Struktur penting

```
src/
  app/
    (public)/            # halaman publik
    (admin)/admin/       # panel admin (dijaga requireAdmin)
    login/               # halaman login
  components/
    admin/               # primitive UI admin (form, tabel, flash, galeri, ...)
  lib/
    queries.ts           # query situs publik (public client, cache/ISR)
    admin/queries.ts     # query admin (cookie client, RLS aktif)
    admin/form.ts        # helper baca FormData + flash via query string
    admin/storage.ts     # upload/hapus gambar Supabase Storage
    auth.ts              # session, requireAdmin, signIn, signOut
    site.ts              # metadata, kontak env, fallback gambar, parser query
  proxy.ts               # refresh session + guard awal (middleware)
supabase/
  migrations/            # skema, RLS, Storage
  seed.sql               # data contoh
```

Catatan arsitektur:

- Query publik memakai `createPublicClient()` (tanpa cookie) supaya hasil tetap
  bisa di-cache; query admin memakai client cookie dari `@/lib/supabase/server`
  agar `auth.uid()` dan RLS `is_admin()` bekerja.
- Setiap server action admin memanggil `requireAdmin()` lebih dulu, apa pun
  nilainya. `src/proxy.ts` hanya lapisan pertama.
- Pesan sukses/error dikirim lewat query string (`?success=` / `?error=`) agar
  tetap stateless di serverless Vercel (tidak ada session flash).
- `HtmlContent` memakai `dangerouslySetInnerHTML`, hanya untuk HTML yang ditulis
  admin di panel. Jangan pernah mengirim input pengguna ke sana.
- Kolom `image` dan `*_images.image_path` menyimpan **URL publik** Supabase
  Storage (atau URL eksternal), bukan path relatif.

## 6. Deploy ke Vercel

1. Push repository ke GitHub/GitLab/Bitbucket.
2. Vercel → **Add New** → **Project** → pilih repository.
3. **Root Directory** wajib `alat-berat-next` (repository Laravel lama masih ada
   satu level di atasnya).
4. Framework preset: **Next.js** (biarkan autodetect).
5. Tambahkan seluruh environment variable pada **Settings → Environment
   Variables** (gunakan domain production untuk `NEXT_PUBLIC_SITE_URL`).
6. Deploy. Migration Supabase **tidak** dijalankan otomatis — jalankan manual
   di SQL Editor seperti pada bagian 4.1.

Tidak ada `output: standalone` yang perlu dikonfigurasi; Vercel menangani build
Next.js secara default.

## 7. Status lint/build

`npm run lint` dan `npm run build` (32 route admin + 13 route publik) berjalan
bersih.

`npm audit` melaporkan 5 vulnerability high pada rantai
`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`
(advisory GHSA-vfj7-8cjw-p6xm, stack exhaustion pada pola glob()). Kesimpulan:

- Hanya memengaruhi tooling lint saat development/build, bukan runtime aplikasi.
- Belum ada versi `braces` yang sudah dipatch, dan `npm audit fix --force`
  akan menurunkan `eslint-config-next` ke 14.x (breaking change, tidak
  disarankan).
- Ditinjau ulang setelah advisory diperbarui.

## 8. Yang belum bisa diuji tanpa kredensial

- Migration, RLS, dan Storage policy di project Supabase nyata.
- Login admin dan provisioning admin pertama.
- Upload/hapus gambar di bucket.
- Deployment Vercel.
