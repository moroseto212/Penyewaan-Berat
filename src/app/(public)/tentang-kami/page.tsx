import type { Metadata } from 'next'
import Image from 'next/image'

import { PageHero } from '@/components/page-hero'
import { getTestimonials } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description:
    'Kenali sejarah, visi, misi, dan nilai-nilai perusahaan AlatBerat, mitra penyedia alat berat dan layanan pertambangan sejak 2010.',
}

const TEAM = [
  { name: 'Andi Pratama', role: 'CEO & Founder', photo: 'photo-1560250097-0b93528c311a' },
  { name: 'Budi Santoso', role: 'COO', photo: 'photo-1519085360753-af0119f7cbe7' },
  { name: 'Citra Dewi', role: 'CFO', photo: 'photo-1573496359142-b8d87734a5a2' },
  { name: 'Dian Permata', role: 'CMO', photo: 'photo-1507003211169-0a1dd7228f2d' },
]

const VALUES = [
  {
    icon: 'fa-handshake',
    title: 'Integritas',
    text: 'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap aspek bisnis.',
  },
  {
    icon: 'fa-medal',
    title: 'Kualitas',
    text: 'Kami hanya menyediakan alat berat berkualitas tinggi dengan perawatan rutin.',
  },
  {
    icon: 'fa-users',
    title: 'Kolaborasi',
    text: 'Bekerja sama erat dengan klien untuk mencapai hasil terbaik.',
  },
  {
    icon: 'fa-shield-alt',
    title: 'Keselamatan',
    text: 'Keselamatan adalah prioritas utama dalam setiap operasi kami.',
  },
]

const MISSIONS = [
  'Menyediakan alat berkualitas tinggi dengan perawatan terbaik',
  'Memberikan layanan cepat, profesional, dan tepat waktu',
  'Mengutamakan keselamatan dan kepuasan pelanggan',
  'Terus berinovasi dalam layanan dan teknologi',
  'Berkontribusi pada pembangunan infrastruktur Indonesia',
]

export default async function AboutPage() {
  const testimonials = await getTestimonials()

  return (
    <>
      <PageHero
        title="Tentang Kami"
        subtitle="Mitra terpercaya Anda dalam penyediaan solusi alat berat sejak 2010."
        backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
        size="sm"
      />

      {/* Cerita kami */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80"
                alt="Tim AlatBerat di lokasi proyek"
                width={800}
                height={600}
                className="rounded-2xl shadow-lg w-full object-cover object-center"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-6">
                Cerita <span className="text-brand">Kami</span>
              </h2>
              <div className="w-16 h-1 bg-brand mb-6" />
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                AlatBerat didirikan pada tahun 2010 dengan visi menjadi penyedia layanan penyewaan
                alat berat terdepan di Indonesia. Berawal dari 5 unit alat berat, kami kini telah
                berkembang menjadi salah satu perusahaan penyewaan alat berat terkemuka dengan armada
                lebih dari 500 unit.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Selama lebih dari 15 tahun, kami telah melayani berbagai proyek di seluruh
                Indonesia, mulai dari proyek konstruksi skala kecil hingga proyek pertambangan dan
                infrastruktur skala besar.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Dengan tim operator berpengalaman dan teknisi profesional, kami berkomitmen untuk memberikan
                layanan terbaik dan memastikan setiap proyek berjalan dengan lancar dan efisien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & misi */}
      <section className="py-12 sm:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">
              Visi & <span className="text-brand">Misi</span>
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-eye text-xl sm:text-2xl text-ink" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink mb-4">Visi</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Menjadi perusahaan penyewaan alat berat terdepan dan terpercaya di Indonesia yang
                memberikan solusi inovatif dan berkelanjutan bagi industri konstruksi,
                pertambangan, dan sektor industri lainnya.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-bullseye text-xl sm:text-2xl text-ink" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink mb-4">Misi</h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-3">
                {MISSIONS.map((mission) => (
                  <li key={mission} className="flex items-start">
                    <i className="fas fa-check-circle text-brand mt-1 mr-3 shrink-0" />
                    {mission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai perusahaan */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">
              Nilai-Nilai <span className="text-brand">Perusahaan</span>
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="text-center p-5 sm:p-8 bg-surface rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-5">
                  <i className={`fas ${value.icon} text-xl sm:text-2xl text-ink`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-ink mb-3">{value.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-12 sm:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">
              Tim <span className="text-brand">Kami</span>
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Tim profesional yang berdedikasi untuk memberikan layanan terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all text-center"
              >
                <Image
                  src={`https://images.unsplash.com/${member.photo}?w=300&q=80`}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover object-center"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-sm sm:text-lg font-bold text-ink">{member.name}</h3>
                  <p className="text-brand text-xs sm:text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      {testimonials.length > 0 && (
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">
                Apa Kata <span className="text-brand">Klien Kami</span>
              </h2>
              <div className="w-20 h-1 bg-brand mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {testimonials.slice(0, 6).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-surface p-5 sm:p-8 rounded-2xl hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <h4 className="font-bold text-ink">{testimonial.client_name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.client_position} - {testimonial.company}
                    </p>
                  </div>
                  <div className="flex mb-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star text-sm ${
                          i < testimonial.rating ? 'text-brand' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}