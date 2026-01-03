import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'

const inter = Inter({ subsets: ['latin'] })

Amplify.configure(outputs)

export const metadata: Metadata = {
  title: 'Fresh Gen2 Amplify App',
  description: 'A fresh Next.js app with Amplify Gen2 backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
