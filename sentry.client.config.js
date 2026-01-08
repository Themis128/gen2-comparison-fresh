// import * as Sentry from '@sentry/nextjs';

// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

//   // Adjust this value in production, or use tracesSampler for greater control
//   tracesSampleRate: 1,

//   // Setting this option to true will print useful information to the console while you're setting
//   // up Sentry.
//   debug: false,

//   replaysOnErrorSampleRate: 1.0,

//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 0.1,

//   // You can remove this option if you're not planning to use the Sentry Session Replay feature:
//   integrations: [
//     Sentry.replayIntegration({
//       // Additional Replay configuration goes in here, for example:
//       maskAllText: true,
//       blockAllMedia: true,
//     }),
//     Sentry.browserTracingIntegration(),
//     Sentry.feedbackIntegration({
//       // Additional Feedback configuration goes in here, for example:
//       colorScheme: 'auto',
//       showBranding: false,
//     }),
//   ],

//   // Performance monitoring
//   enabled: process.env.NODE_ENV === 'production',

//   // Release health
//   environment: process.env.NODE_ENV || 'development',

//   // Filter out health check endpoints and static files
//   beforeSend(event, hint) {
//     // Filter out client-side errors that are not actionable
//     if (event.exception) {
//       const error = hint.originalException;
//       if (error && typeof error === 'string') {
//         // Filter out common browser extension errors
//         if (error.includes('Extension context invalidated') ||
//             error.includes('Non-Error promise rejection captured')) {
//           return null;
//         }
//       }
//     }
//     return event;
//   },

//   // Performance monitoring configuration
//   beforeSendTransaction(event) {
//     // Filter out transactions that are not useful
//     if (event.transaction?.includes('/api/health') ||
//         event.transaction?.includes('/_next/static')) {
//       return null;
//     }
//     return event;
//   },
// });
