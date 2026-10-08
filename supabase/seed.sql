-- =============================================================================
-- Seed data (ported dari database/seeders/*Seeder.php)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
insert into public.categories (id, name, slug, description, icon, is_active, sort_order) values
    (1, 'Excavator',      'excavator',      'Excavator untuk berbagai kebutuhan galian dan konstruksi',                 'fa-solid fa-digging',           true, 1),
    (2, 'Bulldozer',      'bulldozer',      'Bulldozer untuk pekerjaan land clearing dan grading',                       'fa-solid fa-tractor',            true, 2),
    (3, 'Crane',          'crane',          'Crane untuk pengangkatan dan pemindahan material berat',                    'fa-solid fa-tower-cell',         true, 3),
    (4, 'Forklift',       'forklift',       'Forklift untuk material handling di gudang dan industri',                   'fa-solid fa-truck-ramp-box',     true, 4),
    (5, 'Dump Truck',     'dump-truck',     'Dump truck untuk pengangkutan material tambang dan konstruksi',              'fa-solid fa-truck',              true, 5),
    (6, 'Compactor',      'compactor',      'Compactor untuk pemadatan tanah dan aspal',                                  'fa-solid fa-road',               true, 6),
    (7, 'Concrete Mixer', 'concrete-mixer', 'Concrete mixer untuk produksi beton siap pakai',                           'fa-solid fa-drum',               true, 7),
    (8, 'Generator',      'generator',      'Generator set untuk penyediaan listrik cadangan',                           'fa-solid fa-bolt',               true, 8);

select setval(pg_get_serial_sequence('public.categories', 'id'), (select max(id) from public.categories));

-- -----------------------------------------------------------------------------
-- equipment
-- -----------------------------------------------------------------------------
insert into public.equipment (id, category_id, name, slug, brand, model, year, capacity, description, specifications, price, price_unit, status, is_featured, total_units, available_units) values
    (1, 1, 'Excavator PC200-8', 'excavator-pc200-8', 'Komatsu', 'PC200-8', 2020, '20 ton',
        'Excavator Komatsu PC200-8 dengan performa tinggi dan efisiensi bahan bakar yang optimal. Cocok untuk pekerjaan galian, pondasi, dan konstruksi umum.',
        '{"Berat Operasi": "20.000 kg", "Tenaga Mesin": "150 HP", "Kapasitas Bucket": "0.8 mA3", "Konsumsi BBM": "15 L/jam"}'::jsonb,
        2500000, '/hari', 'available', true, 4, 4),

    (2, 1, 'Excavator CAT 320D', 'excavator-cat-320d', 'Caterpillar', '320D', 2021, '22 ton',
        'Excavator Caterpillar 320D dengan teknologi canggih untuk produktivitas maksimal di berbagai medan kerja.',
        '{"Berat Operasi": "22.000 kg", "Tenaga Mesin": "160 HP", "Kapasitas Bucket": "0.9 mA3", "Konsumsi BBM": "16 L/jam"}'::jsonb,
        2800000, '/hari', 'available', true, 3, 3),

    (3, 2, 'Bulldozer D85E', 'bulldozer-d85e', 'Komatsu', 'D85EX-15', 2019, '25 ton',
        'Bulldozer Komatsu D85EX-15 handal untuk pekerjaan land clearing, grading, dan push loading.',
        '{"Berat Operasi": "25.000 kg", "Tenaga Mesin": "230 HP", "Kapasitas Blade": "6.5 mA3", "Konsumsi BBM": "20 L/jam"}'::jsonb,
        3200000, '/hari', 'available', true, 2, 2),

    (4, 3, 'Crane Mobile 50 Ton', 'crane-mobile-50-ton', 'Tadano', 'GR-500EX', 2022, '50 ton',
        'Crane mobile Tadano GR-500EX dengan kapasitas angkat 50 ton, ideal untuk proyek konstruksi gedung tinggi dan jembatan.',
        '{"Kapasitas Maks": "50.000 kg", "Panjang Boom": "42 m", "Tenaga Mesin": "320 HP", "Jarak Jangkau": "50 m"}'::jsonb,
        7500000, '/hari', 'available', true, 1, 1),

    (5, 4, 'Forklift FD30', 'forklift-fd30', 'Toyota', 'FD30', 2021, '3 ton',
        'Forklift Toyota FD30 dengan kehandalan tinggi untuk material handling di gudang dan area industri.',
        '{"Kapasitas Angkat": "3.000 kg", "Tinggi Angkat": "4 m", "Tenaga Mesin": "50 HP", "BBM": "Solar"}'::jsonb,
        900000, '/hari', 'available', true, 6, 6),

    (6, 5, 'Dump Truck Hino 220', 'dump-truck-hino-220', 'Hino', 'FM 220', 2020, '12 mA3',
        'Dump Truck Hino FM 220 dengan bak muat besar, ideal untuk pengangkutan material tambang dan konstruksi.',
        '{"Kapasitas Muat": "12 mA3", "Tenaga Mesin": "220 HP", "Konfigurasi": "6x4", "Konsumsi BBM": "1:4 km/L"}'::jsonb,
        1200000, '/hari', 'available', true, 8, 8),

    (7, 6, 'Compactor Bomag BW211', 'compactor-bomag-bw211', 'Bomag', 'BW211', 2021, '11 ton',
        'Compactor Bomag BW211 untuk pemadatan tanah, aspal, dan base course dengan hasil optimal.',
        '{"Berat Operasi": "11.000 kg", "Lebar Pemadatan": "2.1 m", "Tenaga Mesin": "100 HP", "Frekuensi Getar": "40 Hz"}'::jsonb,
        1500000, '/hari', 'available', false, 3, 3),

    (8, 7, 'Concrete Mixer 1 mA3', 'concrete-mixer-1-m3', 'Stetter', 'C1.0', 2022, '1 mA3',
        'Concrete mixer / molen dengan kapasitas 1 mA3 untuk produksi beton di proyek konstruksi.',
        '{"Kapasitas": "1 mA3", "Tenaga Motor": "15 KW", "Kecepatan Putar": "15 RPM", "Berat": "1.500 kg"}'::jsonb,
        350000, '/hari', 'available', false, 5, 5),

    (9, 8, 'Generator 100 KVA', 'generator-100-kva', 'Cummins', 'C100D5', 2023, '100 KVA',
        'Generator set Cummins 100 KVA untuk penyediaan listrik cadangan proyek dan industri.',
        '{"Daya": "100 KVA / 80 KW", "Tenaga Mesin": "150 HP", "BBM": "Solar", "Konsumsi BBM": "20 L/jam"}'::jsonb,
        2000000, '/hari', 'available', false, 4, 4),

    (10, 1, 'Excavator Mini PC55', 'excavator-mini-pc55', 'Komatsu', 'PC55MR-3', 2022, '5.5 ton',
        'Excavator mini Komatsu PC55MR-3 cocok untuk pekerjaan di area terbatas dan proyek kecil.',
        '{"Berat Operasi": "5.500 kg", "Tenaga Mesin": "50 HP", "Kapasitas Bucket": "0.2 mA3"}'::jsonb,
        1200000, '/hari', 'available', false, 7, 7),

    (11, 2, 'Bulldozer D375A', 'bulldozer-d375a', 'Komatsu', 'D375A-8', 2020, '50 ton',
        'Bulldozer besar Komatsu D375A untuk pekerjaan tambang dan konstruksi berat.',
        '{"Berat Operasi": "50.000 kg", "Tenaga Mesin": "480 HP", "Kapasitas Blade": "12 mA3"}'::jsonb,
        5500000, '/hari', 'available', false, 1, 1),

    (12, 3, 'Crane Crawler 80 Ton', 'crane-crawler-80-ton', 'Sumitomo', 'SCX800', 2021, '80 ton',
        'Crane crawler Sumitomo SCX800 dengan mobilitas tinggi di medan berat.',
        '{"Kapasitas Maks": "80.000 kg", "Panjang Boom": "55 m", "Tenaga Mesin": "350 HP"}'::jsonb,
        12000000, '/hari', 'rented', false, 1, 0);

select setval(pg_get_serial_sequence('public.equipment', 'id'), (select max(id) from public.equipment));

-- -----------------------------------------------------------------------------
-- services
-- -----------------------------------------------------------------------------
insert into public.services (id, title, slug, description, body, icon, is_active) values
    (1, 'Penyewaan Alat Berat', 'penyewaan-alat-berat',
        'Layanan penyewaan berbagai jenis alat berat untuk proyek konstruksi, pertambangan, dan industri dengan armada yang terawat dan berkualitas.',
        $html$<h3>Layanan Penyewaan Alat Berat</h3><p>Kami menyediakan berbagai jenis alat berat untuk mendukung kelancaran proyek Anda. Armada kami terdiri dari excavator, bulldozer, crane, forklift, dump truck, compactor, dan berbagai alat berat lainnya yang siap digunakan kapan saja.</p><p>Setiap unit alat berat kami menjalani perawatan rutin dan pemeriksaan menyeluruh sebelum disewakan untuk memastikan performa optimal dan keamanan operasional.</p><h4>Keunggulan Layanan Kami:</h4><ul><li>Armada lengkap dan terawat</li><li>Operator berpengalaman dan bersertifikasi</li><li>Pengiriman tepat waktu</li><li>Dukungan teknis 24/7</li><li>Harga kompetitif</li></ul>$html$,
        'fa-solid fa-tractor', true),

    (2, 'Operator & Tenaga Ahli', 'operator-tenaga-ahli',
        'Menyediakan operator profesional dan tenaga ahli bersertifikasi untuk mengoperasikan alat berat dengan aman dan efisien.',
        $html$<h3>Operator & Tenaga Ahli Bersertifikasi</h3><p>Kami menyediakan operator berpengalaman yang telah memiliki sertifikasi resmi dari instansi terkait. Setiap operator kami telah melalui pelatihan ketat dan memiliki jam terbang tinggi.</p>$html$,
        'fa-solid fa-helmet-safety', true),

    (3, 'Perawatan & Perbaikan', 'perawatan-perbaikan',
        'Layanan perawatan dan perbaikan alat berat oleh teknisi handal dengan suku cadang original untuk memastikan alat berat tetap dalam kondisi prima.',
        $html$<h3>Layanan Perawatan & Perbaikan</h3><p>Tim teknisi kami siap menangani perawatan rutin hingga perbaikan besar alat berat Anda. Kami menggunakan suku cadang original dan peralatan diagnostik modern.</p>$html$,
        'fa-solid fa-wrench', true),

    (4, 'Konsultasi Proyek', 'konsultasi-proyek',
        'Layanan konsultasi untuk membantu Anda memilih alat berat yang tepat sesuai kebutuhan dan anggaran proyek Anda.',
        $html$<h3>Konsultasi Proyek</h3><p>Tim konsultan kami siap membantu Anda menentukan alat berat yang paling sesuai dengan kebutuhan proyek, mulai dari pemilihan jenis, spesifikasi, hingga estimasi biaya operasional.</p>$html$,
        'fa-solid fa-handshake', true),

    (5, 'Logistik & Mobilisasi', 'logistik-mobilisasi',
        'Layanan pengiriman dan mobilisasi alat berat ke lokasi proyek di seluruh Indonesia dengan aman dan tepat waktu.',
        $html$<h3>Logistik & Mobilisasi</h3><p>Kami menangani pengiriman alat berat ke lokasi proyek Anda di mana pun berada. Dengan armada transportasi khusus dan tim logistik yang berpengalaman, alat berat Anda akan tiba dengan aman dan tepat waktu.</p>$html$,
        'fa-solid fa-truck-fast', true);

select setval(pg_get_serial_sequence('public.services', 'id'), (select max(id) from public.services));

-- -----------------------------------------------------------------------------
-- service_areas
-- -----------------------------------------------------------------------------
insert into public.service_areas (id, name, slug, description, is_active) values
    (1, 'Jakarta',    'jakarta',    'Area layanan Jakarta dan sekitarnya, mencakup proyek infrastruktur dan gedung bertingkat.',           true),
    (2, 'Bandung',    'bandung',    'Area layanan Bandung dan Jawa Barat, melayani proyek properti dan infrastruktur.',                true),
    (3, 'Surabaya',   'surabaya',   'Area layanan Surabaya dan Jawa Timur, mencakup proyek industri dan pelabuhan.',                  true),
    (4, 'Medan',      'medan',      'Area layanan Medan dan Sumatera Utara, melayani proyek perkebunan dan infrastruktur.',           true),
    (5, 'Makassar',   'makassar',   'Area layanan Makassar dan Sulawesi, mencakup proyek tambang dan infrastruktur.',                 true),
    (6, 'Balikpapan', 'balikpapan', 'Area layanan Balikpapan dan Kalimantan, melayani proyek tambang dan perkebunan.',               true),
    (7, 'Palembang',  'palembang',  'Area layanan Palembang dan Sumatera Selatan, mencakup proyek infrastruktur dan pertambangan.',    true),
    (8, 'Batam',      'batam',      'Area layanan Batam dan Kepulauan Riau, melayani proyek industri dan perkapalan.',               true),
    (9, 'Semarang',   'semarang',   'Area layanan Semarang dan Jawa Tengah, mencakup proyek properti dan infrastruktur.',            true),
    (10, 'Denpasar',   'denpasar',   'Area layanan Denpasar dan Bali, melayani proyek pariwisata dan properti.',                        true);

select setval(pg_get_serial_sequence('public.service_areas', 'id'), (select max(id) from public.service_areas));

-- -----------------------------------------------------------------------------
-- projects
-- -----------------------------------------------------------------------------
insert into public.projects (id, title, slug, description, client, location, equipment_used, start_date, end_date, is_featured, is_active) values
    (1, 'Proyek Pembangunan Jalan Tol Trans Jawa', 'jalan-tol-trans-jawa',
        'Penyewaan alat berat untuk pembangunan jalan tol di jalur Pantai Utara Jawa dengan durasi 18 bulan.',
        'PT Jasamarga Tollroad Operator', 'Pantai Utara Jawa', 'Excavator, Bulldozer, Dump Truck, Compactor',
        '2024-01-15', '2025-07-15', true, true),

    (2, 'Proyek Tambang Batubara Kalimantan Timur', 'tambang-batubara-kaltim',
        'Penyediaan alat berat untuk operasional tambang batubara di Kalimantan Timur dengan kapasitas produksi tinggi.',
        'PT Bumi Resources Tbk', 'Kalimantan Timur', 'Bulldozer D375A, Excavator PC200, Dump Truck Hino',
        '2024-03-01', '2026-02-28', true, true),

    (3, 'Pembangunan Gedung Perkantoran Jakarta CBD', 'gedung-perkantoran-jakarta-cbd',
        'Penyewaan crane dan alat berat untuk konstruksi gedung 40 lantai di kawasan bisnis Jakarta.',
        'PT Agung Podomoro Land', 'Jakarta Selatan', 'Crane Mobile 50 Ton, Excavator, Concrete Mixer',
        '2024-06-01', '2025-12-31', true, true),

    (4, 'Proyek Pabrik Smelter Nikel Sulawesi', 'pabrik-smelter-nikel-sulawesi',
        'Penyediaan alat berat untuk pembangunan pabrik smelter nikel di Sulawesi Tengah.',
        'PT Vale Indonesia Tbk', 'Sulawesi Tengah', 'Excavator, Crane Crawler, Bulldozer, Dump Truck',
        '2024-08-15', null, false, true),

    (5, 'Proyek Bandara Internasional Lombok', 'bandara-internasional-lombok',
        'Penyewaan alat berat untuk perluasan dan pengembangan Bandara Internasional Lombok.',
        'PT Angkasa Pura I', 'Lombok, NTB', 'Excavator, Bulldozer, Compactor, Dump Truck',
        '2024-02-01', '2025-08-31', false, true),

    (6, 'Proyek PLTA Batang Toru', 'plta-batang-toru',
        'Penyediaan alat berat untuk pembangunan Pembangkit Listrik Tenaga Air di Sumatera Utara.',
        'PT Inalum', 'Sumatera Utara', 'Excavator, Dump Truck, Crane, Concrete Mixer',
        '2024-04-01', null, false, true);

select setval(pg_get_serial_sequence('public.projects', 'id'), (select max(id) from public.projects));

-- -----------------------------------------------------------------------------
-- testimonials
-- -----------------------------------------------------------------------------
insert into public.testimonials (id, client_name, client_position, company, content, rating, is_active, is_featured) values
    (1, 'Bambang Supriyadi', 'Project Manager',     'PT Wijaya Karya Tbk', 'AlatBerat memberikan layanan penyewaan alat berat yang sangat profesional. Armada mereka terawat dengan baik dan pengiriman selalu tepat waktu. Sangat merekomendasikan!', 5, true, true),
    (2, 'Dewi Sartika',     'Site Manager',        'PT PP Tbk',            'Kami sudah bekerja sama dengan AlatBerat untuk 3 proyek besar. Kualitas alat dan dukungan teknisnya luar biasa. Operator yang dikirim juga sangat berpengalaman.', 5, true, true),
    (3, 'Andi Hakim',       'Owner',               'CV Karya Mandiri',       'Harga sewa yang kompetitif dengan kualitas alat yang bagus. Proses sewa juga mudah dan cepat. Sangat membantu proyek kami.', 4, true, false),
    (4, 'Rina Marlina',     'Procurement Manager', 'PT Adhi Karya Tbk',    'Tim AlatBerat sangat responsif dalam menangani kebutuhan alat berat kami. Bahkan untuk permintaan mendadak, mereka selalu bisa mengakomodasi.', 5, true, true),
    (5, 'Hendra Gunawan',   'Direktur',            'PT Bangun Cipta',       'Pelayanan after sales yang sangat baik. Tim teknis selalu siap membantu jika ada masalah dengan alat. Recommended untuk penyewaan alat berat.', 4, true, false);

select setval(pg_get_serial_sequence('public.testimonials', 'id'), (select max(id) from public.testimonials));

-- -----------------------------------------------------------------------------
-- blog_posts
-- -----------------------------------------------------------------------------
insert into public.blog_posts (id, title, slug, excerpt, body, author, tags, is_published, published_at) values
    (1, 'Tips Memilih Alat Berat yang Tepat untuk Proyek Konstruksi', 'tips-memilih-alat-berat-proyek-konstruksi',
        'Panduan lengkap memilih alat berat yang sesuai dengan kebutuhan proyek konstruksi Anda agar efisien dan hemat biaya.',
        $html$<h3>Pendahuluan</h3><p>Memilih alat berat yang tepat adalah keputusan krusial dalam setiap proyek konstruksi. Pemilihan yang salah dapat mengakibatkan pembengkakan biaya, keterlambatan proyek, bahkan kegagalan struktural.</p><h3>Faktor-faktor yang Perlu Dipertimbangkan</h3><p>1. Jenis Pekerjaan<br>2. Kondisi Medan<br>3. Kapasitas yang Dibutuhkan<br>4. Durasi Proyek<br>5. Anggaran</p><h3>Kesimpulan</h3><p>Konsultasikan dengan tim ahli kami untuk mendapatkan rekomendasi alat berat yang paling sesuai dengan kebutuhan proyek Anda.</p>$html$,
        'Tim AlatBerat', '["konstruksi", "tips", "alat berat"]'::jsonb, true, '2025-12-15 08:00:00+07'),

    (2, 'Perawatan Rutin Alat Berat untuk Memperpanjang Umur Mesin', 'perawatan-rutin-alat-berat',
        'Ketahui pentingnya perawatan rutin alat berat dan cara-cara sederhana yang bisa dilakukan untuk memperpanjang usia mesin.',
        $html$<h3>Mengapa Perawatan Rutin Penting?</h3><p>Perawatan rutin adalah investasi jangka panjang untuk alat berat Anda. Dengan perawatan yang tepat, umur mesin dapat diperpanjang hingga 30% lebih lama.</p><h3>Jadwal Perawatan</h3><p>Kami merekomendasikan jadwal perawatan rutin setiap 250 jam operasi untuk pergantian oli dan filter.</p>$html$,
        'Tim AlatBerat', '["perawatan", "alat berat", "tips"]'::jsonb, true, '2026-01-20 09:30:00+07'),

    (3, 'Keuntungan Sewa Alat Berat Dibanding Beli', 'keuntungan-sewa-alat-berat',
        'Analisis lengkap mengapa menyewa alat berat lebih menguntungkan daripada membeli untuk banyak jenis proyek.',
        $html$<h3>Mengapa Sewa Lebih Baik?</h3><p>Menyewa alat berat memberikan fleksibilitas yang tidak bisa diberikan oleh pembelian. Anda bisa menyesuaikan jenis dan jumlah alat sesuai kebutuhan proyek.</p><h3>Keuntungan Utama:</h3><p>1. Tidak perlu modal besar di awal<br>2. Bebas biaya perawatan<br>3. Armada selalu terbaru<br>4. Fleksibilitas tinggi</p>$html$,
        'Tim AlatBerat', '["sewa", "alat berat", "bisnis"]'::jsonb, true, '2026-03-10 10:00:00+07'),

    (4, 'Standar Keselamatan Operasi Alat Berat di Indonesia', 'standar-keselamatan-operasi-alat-berat',
        'Panduan mengenai standar keselamatan kerja dalam pengoperasian alat berat yang berlaku di Indonesia.',
        $html$<h3>Regulasi Keselamatan</h3><p>Pemerintah Indonesia telah menetapkan berbagai regulasi terkait keselamatan operasi alat berat yang wajib dipatuhi oleh semua pihak.</p>$html$,
        'Tim AlatBerat', '["keselamatan", "regulasi", "K3"]'::jsonb, true, '2026-04-05 07:45:00+07'),

    (5, 'Inovasi Teknologi Alat Berat 2026', 'inovasi-teknologi-alat-berat-2026',
        'Perkembangan teknologi terbaru dalam dunia alat berat yang akan mengubah cara kerja industri konstruksi dan pertambangan.',
        $html$<h3>Teknologi Terbaru</h3><p>Dunia alat berat terus berkembang dengan teknologi AI, IoT, dan otomatisasi yang semakin canggih.</p>$html$,
        'Tim AlatBerat', '["teknologi", "inovasi", "2026"]'::jsonb, false, null);

select setval(pg_get_serial_sequence('public.blog_posts', 'id'), (select max(id) from public.blog_posts));

-- -----------------------------------------------------------------------------
-- faqs
-- -----------------------------------------------------------------------------
insert into public.faqs (id, question, answer, category, sort_order, is_active) values
    (1, 'Berapa minimal durasi sewa alat berat?',
        'Minimal durasi sewa alat berat kami adalah 1 hari (8 jam kerja). Untuk proyek jangka panjang, kami menyediakan paket khusus dengan harga lebih kompetitif.',
        'Penyewaan', 1, true),
    (2, 'Apakah alat berat disertai operator?',
        'Ya, setiap penyewaan alat berat dapat disertai operator berpengalaman dan bersertifikat. Biaya operator sudah termasuk dalam paket sewa tertentu atau dapat ditambahkan sesuai kebutuhan.',
        'Penyewaan', 2, true),
    (3, 'Bagaimana cara pemesanan?',
        'Pemesanan dapat dilakukan melalui website, telepon, WhatsApp, atau datang langsung ke kantor kami. Tim kami akan membantu Anda memilih alat berat yang sesuai dan memproses penyewaan dengan cepat.',
        'Penyewaan', 3, true),
    (4, 'Apakah ada biaya pengiriman?',
        'Ya, biaya pengiriman alat berat ke lokasi proyek dihitung terpisah berdasarkan jarak dan jenis alat. Kami akan memberikan quote lengkap termasuk biaya pengiriman sebelum transaksi.',
        'Biaya', 4, true),
    (5, 'Bagaimana jika alat berat rusak saat disewa?',
        'Jika kerusakan terjadi karena pemakaian normal, kami akan menangani perbaikan tanpa biaya tambahan. Namun, jika kerusakan disebabkan oleh kelalaian penyewa, biaya perbaikan akan ditanggung penyewa.',
        'Layanan', 5, true),
    (6, 'Apakah tersedia layanan perawatan alat berat?',
        'Ya, kami menyediakan layanan perawatan dan perbaikan alat berat untuk semua merek. Tim teknisi kami siap melakukan perawatan rutin maupun perbaikan besar.',
        'Layanan', 6, true),
    (7, 'Wilayah mana saja yang dilayani?',
        'Kami melayani seluruh wilayah Indonesia, dengan kantor cabang di Jakarta, Bandung, Surabaya, Medan, Makassar, Balikpapan, dan kota-kota besar lainnya.',
        'Layanan', 7, true),
    (8, 'Pembayaran menggunakan apa saja?',
        'Kami menerima pembayaran melalui transfer bank (BCA, Mandiri, BRI, BNI), kartu kredit, dan giro. Untuk proyek jangka panjang, tersedia sistem termin pembayaran.',
        'Biaya', 8, true),
    (9, 'Apakah saya bisa melihat alat berat sebelum menyewa?',
        'Tentu saja. Anda dapat mengunjungi depot kami untuk melihat langsung kondisi alat berat yang akan disewa. Kami juga dapat mengirimkan foto dan video kondisi alat terkini.',
        'Penyewaan', 9, true),
    (10, 'Berapa deposit yang harus dibayarkan?',
        'Deposit sebesar 20-30% dari total biaya sewa dikenakan tergantung jenis alat dan durasi sewa. Deposit akan dikembalikan setelah alat dikembalikan dalam kondisi baik.',
        'Biaya', 10, true);

select setval(pg_get_serial_sequence('public.faqs', 'id'), (select max(id) from public.faqs));

-- =============================================================================
-- Catatan: admin tidak di-seed lewat SQL.
-- Buat user lewat Supabase Dashboard (Authentication > Users > Add user),
-- lalu jalankan SQL berikut untuk memberikan akses admin:
--
--   insert into public.admin_users (id, email, name, is_admin)
--   select id, email, coalesce(raw_user_meta_data->>'name', email), true
--   from auth.users where email = 'admin@alatberat.com';
--
-- Alternatif: signup via /admin/login lalu jalankan SQL di atas.
-- =============================================================================
