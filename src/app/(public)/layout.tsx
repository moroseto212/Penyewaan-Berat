import { MotionProvider, PageTransition } from '@/components/motion'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WhatsAppButton } from '@/components/whatsapp-button'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SiteHeader />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </MotionProvider>
  )
}
