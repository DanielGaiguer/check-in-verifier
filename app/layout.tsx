import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { Inter_Tight } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import Sidebar from '@/components/sidebar'
import SidebarSheet from '@/components/sidebar-sheet'
import { ClientProvider } from './ClienteProvider'

export const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-title', // variável CSS
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Gerenciador de Check-ins',
  description: 'Registre e gerencie os Check-ins diários de laboratórios de forma eficiente e tenha acesso ao monitoramento da organização.',
  openGraph: {
    title: 'Gerenciador de Check-ins',
    description: 'Registre e gerencie os Check-ins diários de laboratórios de forma eficiente e tenha acesso ao monitoramento da organização.',
    url: 'https://check-in-verifier.vercel.app',
    siteName: 'LabCheck',
    images: [
      {
        url: 'https://check-in-verifier.vercel.app/icons/icon-192.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gerenciador de Check-ins',
    description: 'Registre e gerencie os Check-ins diários de laboratórios de forma eficiente e tenha acesso ao monitoramento da organização.',
    images: [
      'https://check-in-verifier.vercel.app/icons/icon-192.png',
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={` ${interTight.variable} bg-background text-foreground`}
    >
      <head>
        {/* Open Graph & Twitter meta tags (caso precise reforçar) */}
        <meta property="og:title" content={String(metadata.title)} />
        <meta property="og:description" content={metadata.description!} />
        <meta
          property="og:image"
          content="https://check-in-verifier.vercel.app/icons/icon-512.png"
        />
        <meta
          property="og:url"
          content="https://check-in-verifier.vercel.app"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={String(metadata.title)} />
        <meta name="twitter:description" content={metadata.description!} />
        <meta
          name="twitter:image"
          content="https://check-in-verifier.vercel.app/icons/icon-512.png"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <ClientProvider>
          <div className="flex flex-col items-center bg-black">
            <div className="h-full w-[98%] rounded-t-xl">
              <div className="mt-2 flex rounded-t-xl bg-gray-50">
                {/* Sidebar fixa */}
                <Sidebar />
                <main className="flex-1">
                  {/* Mobile */}
                  <div className="sticky top-0 z-50 h-14 rounded-t-2xl border-b border-gray-300 bg-gray-50 shadow-2xs md:hidden">
                    <SidebarSheet />
                  </div>
                  <Header />
                  {children}
                  <ToastContainer />
                </main>
              </div>
            </div>
          </div>
        </ClientProvider>
      </body>
    </html>
  )
}
