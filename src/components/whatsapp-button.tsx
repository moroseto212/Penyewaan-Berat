import { SITE } from '@/lib/site'

export function WhatsAppButton() {
  if (!SITE.whatsapp) return null

  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50 animate-bounce"
    >
      <i className="fab fa-whatsapp text-white text-3xl" />
    </a>
  )
}
