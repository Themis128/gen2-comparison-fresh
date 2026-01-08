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
import '../globals.css';
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Get messages for the current locale
  const { locale } = await params;
  const messages = await getMessages();

  // Check for test mode from environment or URL params
  const testMode =
    process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('test-mode') === 'true');

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cloudless" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/cloudless-favicon.ico" />
        <script dangerouslySetInnerHTML={{ __html: `window.testMode = ${testMode};` }} />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Themistoklis Baltzakis',
              jobTitle: 'ML/LLM Engineer',
              description:
                'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
              url: 'https://baltzakisthemis.com',
              sameAs: [
                'https://github.com/Themis128',
                'https://www.linkedin.com/in/baltzakis-themis',
              ],
              knowsAbout: [
                'Network Engineering',
                'Cloud Computing',
                'Cisco Systems',
                'Azure Active Directory',
                'Microsoft 365',
                'AWS Cloud',
                'Data Analytics',
                'Python',
                'TypeScript',
                'Next.js',
              ],
              hasOccupation: {
                '@type': 'Occupation',
                name: 'ML/LLM Engineer',
                occupationLocation: {
                  '@type': 'Country',
                  name: 'Greece',
                },
              },
            }),
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true
                  });
                `,
              }}
            />
          </>
        )}

        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof window === 'undefined') return;
                  const origConsoleError = console.error;
                  const origConsoleWarn = console.warn;
                  const origConsoleLog = console.log;
                  const origConsoleInfo = console.info;

                  const suppressedPatterns = [
                    /Download the React DevTools/i,
                    /\\[HMR\\] connected/i,
                    /Added non-passive event listener to a scroll-blocking 'wheel' event/i,
                    /⬆️⬆️⬆️ Those two errors are expected!/i,
                  ];

                  function shouldSuppress(first) {
                    if (typeof first !== 'string') return false;
                    return suppressedPatterns.some(p => (p instanceof RegExp ? p.test(first) : first.includes(p)));
                  }

                  console.error = function(...args) {
                    try {
                      const first = args[0];
                      if (shouldSuppress(first)) return;
                    } catch (e) {}
                    return origConsoleError.apply(console, args);
                  };

                  console.warn = function(...args) {
                    try {
                      const first = args[0];
                      if (shouldSuppress(first)) return;
                    } catch (e) {}
                    return origConsoleWarn.apply(console, args);
                  };

                  console.log = function(...args) {
                    try {
                      const first = args[0];
                      if (shouldSuppress(first)) return;
                    } catch (e) {}
                    return origConsoleLog.apply(console, args);
                  };

                  console.info = function(...args) {
                    try {
                      const first = args[0];
                      if (shouldSuppress(first)) return;
                    } catch (e) {}
                    return origConsoleInfo.apply(console, args);
                  };
                })();
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <IntlProvider locale={locale} messages={messages}>
          <AmplifyInitializer />
          <WebVitals />
          <ErrorBoundary>
            <Providers>
              <div
                className="site-tech-overlay pointer-events-none fixed inset-0 z-0"
                aria-hidden="true"
              />
              <Toaster />
              {/* <DevConsoleFilter /> */}
              {/* <DevListenerPatch /> */}
              {/* <InstallPrompt /> */}
              {/* <PWARegistration /> */}
              <NavigationWrapper />
              {children}
            </Providers>
          </ErrorBoundary>
        </IntlProvider>
      </body>
    </html>
  );
}
