import '@aws-amplify/ui-react/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AmplifyInitializer from '../components/AmplifyInitializer';
import CustomNavigation from '../components/CustomNavigation';
import DevConsoleFilter from '../components/DevConsoleFilter';
import DevListenerPatch from '../components/DevListenerPatch';
import InstallPrompt from '../components/InstallPrompt';
// import ToolbarMountController from '../components/ToolbarMountController';
import './globals.css';
import '../lib/amplify-client-config'; // Configure Amplify early
import { ThemeProvider } from '../lib/theme-context';
import '../styles/app.css'; // Custom styles
// import '@aws-amplify/ui-react-ai/styles.css'; // AI UI styles - removed as package may not have styles

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Themistoklis Baltzakis - ML/LLM Engineer',
    description:
      'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
    creator: '@your-twitter-handle', // Replace with your Twitter handle
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="TBaltzakis Portfolio"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/cloudless-favicon.ico" />

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
                    /Max reconnection attempts reached/,
                    /Attempting to reconnect/i,
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
        suppressHydrationWarning={true}
      >
        <AmplifyInitializer />
        <ThemeProvider>
          {/* Global tech overlay */}
          <div
            className="site-tech-overlay pointer-events-none fixed inset-0 z-0"
            aria-hidden="true"
          />
          <CustomNavigation />
          {children}
          <InstallPrompt />
        </ThemeProvider>
        {process.env.NODE_ENV === 'development' && <DevListenerPatch />}
        {process.env.NODE_ENV === 'development' && <DevConsoleFilter />}
        {/* 
          Dev-only patches for console noise and passive listener violations.
        */}
        {/* <ToolbarMountController /> */}
      </body>
    </html>
  );
}
