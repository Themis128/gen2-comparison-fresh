// import * as Sentry from '@sentry/nextjs';

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,

//   // Adjust this value in production, or use tracesSampler for greater control
//   tracesSampleRate: 1,

//   // Setting this option to true will print useful information to the console while you're setting
//   // up Sentry.
//   debug: false,

//   // Performance monitoring
//   enabled: process.env.NODE_ENV === 'production',

//   // Release health
//   environment: process.env.NODE_ENV || 'development',

//   // Server-side filtering
//   beforeSend(event, hint) {
//     // Filter out server-side errors that are not actionable
//     if (event.exception) {
//       const error = hint.originalException;
//       if (error && typeof error === 'string') {
//         // Filter out common Next.js development errors
//         if (error.includes('Fast Refresh') ||
//             error.includes('webpack') ||
//             error.includes('Module not found')) {
//           return null;
//         }
//       }
//     }
//     return event;
//   },

//   // Performance monitoring for server-side operations
//   beforeSendTransaction(event) {
//     // Filter out server transactions that are not useful
//     if (event.transaction?.includes('/api/og') ||
//         event.transaction?.includes('/_next/image')) {
//       return null;
//     }
//     return event;
//   },

//   // Integrations for server-side
//   integrations: [
//     // HTTP integration for server-side requests
//     Sentry.httpIntegration({ tracing: true }),
//     // Database integration if using databases
//     // Sentry.mongoIntegration(),
//     // Sentry.postgresIntegration(),
//   ],
// });
