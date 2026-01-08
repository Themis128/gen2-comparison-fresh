import '@aws-amplify/ui-react/styles.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { Toaster } from 'sonner';

import AmplifyInitializer from '@/components/AmplifyInitializer';
// import AuthWrapper from '@/components/AuthWrapper';
import ErrorBoundary from '@/components/SentryErrorBoundary';
import IntlProvider from '@/components/IntlProvider';
import NavigationWrapper from '@/components/NavigationWrapper';
import { Providers } from '@/components/Providers';
// import ToolbarMountController from '@/components/ToolbarMountController';
import WebVitals from '@/components/WebVitals';
import '@/lib/amplify-client-config'; // Configure Amplify early
import { getMessages } from 'next-intl/server';

import type { Metadata, Viewport } from 'next';

import '@/styles/app.css'; // Custom styles
import './globals.css';
// import '@aws-amplify/ui-react-ai/styles.css'; // AI UI styles - removed as package may not have styles

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Themistoklis Baltzakis - ML/LLM Engineer',
  description:
    'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
  authors: [{ name: 'Themistoklis Baltzakis' }],
  creator: 'Themistoklis Baltzakis',
  publisher: 'Themistoklis Baltzakis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-portfolio-domain.com'), // Replace with your actual domain
  icons: {
    icon: '/cloudless-favicon.ico',
    apple: '/cloudless-favicon.ico',
  },
  openGraph: {
    title: 'Themistoklis Baltzakis - ML/LLM Engineer',
    description:
      'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
    url: 'https://your-portfolio-domain.com',
    siteName: 'Themistoklis Baltzakis Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Themistoklis%20Baltzakis%20-%20ML%2FLLM%20Engineer&description=ML%2FLLM%20Engineer%20with%20over%2015%20years%20of%20experience&type=website&author=Themistoklis%20Baltzakis',
        width: 1200,
        height: 630,
        alt: 'Themistoklis Baltzakis - ML/LLM Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Themistoklis Baltzakis - ML/LLM Engineer',
    description:
      'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
    creator: '@your-twitter-handle', // Replace with your Twitter handle
    images: [
      {
        url: '/api/og?title=Themistoklis%20Baltzakis%20-%20ML%2FLLM%20Engineer&description=ML%2FLLM%20Engineer%20with%20over%2015%20years%20of%20experience&type=website&author=Themistoklis%20Baltzakis',
        alt: 'Themistoklis Baltzakis - ML/LLM Engineer',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
