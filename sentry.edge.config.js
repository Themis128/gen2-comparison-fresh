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

//   // Edge runtime specific configuration
//   beforeSend(event, hint) {
//     // Filter out edge runtime errors that are not actionable
//     if (event.exception) {
//       const error = hint.originalException;
//       if (error && typeof error === 'string') {
//         // Filter out common edge runtime errors
//         if (error.includes('Edge Runtime') ||
//             error.includes('Vercel')) {
//           return null;
//         }
//       }
//     }
//     return event;
//   },
// });
