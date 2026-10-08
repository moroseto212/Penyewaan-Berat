import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    /**
     * Kolom gambar diisi dari panel admin dan dapat berisi URL host mana saja.
     * Data lama dari Laravel memakai hotlink ke domain pihak ketiga
     * (img.waimaoniu.net, imgcdn.oto.com, static.wixstatic.com, dan lainnya),
     * sedangkan daftar host lama hanya Supabase Storage, Unsplash, dan Pexels,
     * sehingga hampir semua gambar asli tidak akan ditampilkan.
     * Karena itu semua host https diizinkan.
     */
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
}

export default nextConfig
