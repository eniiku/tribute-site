import type { Metadata } from 'next'
import { Crimson_Pro, Inter } from 'next/font/google'
import Navigation from '@/components/navigation'
import AudioPlayer from '@/components/audio-player'
import { Toaster } from '@/components/ui/sonner'

import '../globals.css'
import Footer from '@/components/footer'
import { ThemeProvider } from 'next-themes'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const crimson_pro = Crimson_Pro({
  variable: '--font-crimson-pro',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Thank A Soldier - Honouring Our Heroes',
  description:
    'A national space to honour all Nigerian soldiers - those who gave their lives and those who continue to serve and protect our nation.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${crimson_pro.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <Navigation />
          <AudioPlayer />

          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
