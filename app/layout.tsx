import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bankerr | The Xoom of Crypto',
  description: 'Send money to 160+ countries in seconds. Web2 simplicity, Web3 power.',
  keywords: ['crypto', 'payments', 'remittance', 'blockchain', 'fintech'],
  openGraph: {
    title: 'Bankerr | The Xoom of Crypto',
    description: 'Send money to 160+ countries in seconds.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
