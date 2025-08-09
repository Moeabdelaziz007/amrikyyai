import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amrikyy AI - RAG-Powered Assistant',
  description: 'مساعد ذكي، موجز، واعٍ للسياق، يعطي إجابات مستندة إلى مصادر',
  keywords: 'AI, RAG, Assistant, Arabic, ChatGPT, Documents',
  authors: [{ name: 'Amrikyy AI Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
