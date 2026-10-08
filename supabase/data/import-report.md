# Laporan import data Laravel

Dihasilkan oleh `scripts/import-laravel-data.py`.

## Jumlah baris

| Tabel | Baris |
| --- | --- |
| `categories` | 8 |
| `services` | 5 |
| `service_areas` | 10 |
| `testimonials` | 5 |
| `equipment` | 11 |
| `equipment_images` | 11 |
| `projects` | 5 |
| `project_images` | 5 |
| `blog_posts` | 5 |
| `faqs` | 10 |
| `contacts` | 0 |

## Dilewati

| Tabel | Alasan |
| --- | --- |
| `cache` | tabel infrastruktur Laravel |
| `cache_locks` | tabel infrastruktur Laravel |
| `failed_jobs` | tabel infrastruktur Laravel |
| `job_batches` | tabel infrastruktur Laravel |
| `jobs` | tabel infrastruktur Laravel |
| `migrations` | tabel infrastruktur Laravel |
| `password_reset_tokens` | tabel infrastruktur Laravel |
| `sessions` | tabel infrastruktur Laravel |
| `users` | autentikasi pindah ke Supabase Auth |

## Catatan

- equipment#2: JSON di-decode dua kali -> dinormalisasi
- equipment#3: JSON di-decode dua kali -> dinormalisasi
- equipment#4: JSON di-decode dua kali -> dinormalisasi
- equipment#5: JSON di-decode dua kali -> dinormalisasi
- equipment#6: JSON di-decode dua kali -> dinormalisasi
- equipment#7: JSON di-decode dua kali -> dinormalisasi
- equipment#8: JSON di-decode dua kali -> dinormalisasi
- equipment#9: JSON di-decode dua kali -> dinormalisasi
- equipment#10: JSON di-decode dua kali -> dinormalisasi
- equipment#11: JSON di-decode dua kali -> dinormalisasi
- equipment#12: JSON di-decode dua kali -> dinormalisasi
- blog_posts#1: JSON di-decode dua kali -> dinormalisasi
- blog_posts#2: JSON di-decode dua kali -> dinormalisasi
- blog_posts#3: JSON di-decode dua kali -> dinormalisasi
- blog_posts#4: JSON di-decode dua kali -> dinormalisasi
- blog_posts#5: JSON di-decode dua kali -> dinormalisasi

## Host gambar eksternal

Semua nilai gambar berupa URL eksternal. Host ini harus diizinkan oleh
`next/image` lewat `images.remotePatterns` di `next.config.ts`:

- `5.imimg.com`
- `blogger.googleusercontent.com`
- `encrypted-tbn0.gstatic.com`
- `image.made-in-china.com`
- `images-tm.tempo.co`
- `images.bisnis.com`
- `img.waimaoniu.net`
- `imgcdn.espos.id`
- `imgcdn.oto.com`
- `m.indonesian.secondhandexcavators.com`
- `media.exapro.com`
- `p16-oec-sg.ibyteimg.com`
- `psualatberat.com`
- `static.wixstatic.com`
- `www.interjaya.com`
- `www.komatsu-africa.com`
- `www.safetysign.co.id`
