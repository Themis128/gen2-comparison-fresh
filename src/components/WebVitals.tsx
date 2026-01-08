'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

export default function WebVitals() {
  useEffect(() => {
    // Web Vitals monitoring with Sentry integration
    import('web-vitals')
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        const reportWebVitals = ({ name, value, id, delta }: WebVitalsMetric) => {
          // Log to console in development
          if (process.env.NODE_ENV === 'development') {
            console.log(`Web Vital ${name}:`, { value, id, delta });
          }

          // Send to Sentry for monitoring (disabled)
          // Sentry.metrics.distribution(
          //   `web_vitals.${name.toLowerCase()}`,
          //   value,
          //   {
          //     unit: 'millisecond',
          //     tags: {
          //       metric_id: id,
          //       environment: process.env.NODE_ENV || 'development',
          //     },
          //   }
          // );

          // Send performance data to Sentry (disabled)
          // Sentry.captureMessage(`Web Vital: ${name}`, {
          //   level: 'info',
          //   tags: {
          //     web_vital: name,
          //     performance: true,
          //   },
          //   extra: {
          //     value,
          //     delta,
          //     id,
          //     timestamp: Date.now(),
          //   },
          // });

          // Check for poor performance and alert
          const thresholds = {
            LCP: 2500, // 2.5s
            FID: 100, // 100ms
            CLS: 0.1, // 0.1
            FCP: 1800, // 1.8s
            TTFB: 800, // 800ms
            INP: 200, // 200ms
          };

          const threshold = thresholds[name as keyof typeof thresholds];
          if (threshold && value > threshold) {
            Sentry.captureMessage(`Poor Web Vital Performance: ${name}`, {
              level: 'warning',
              tags: {
                web_vital: name,
                performance_issue: true,
                poor_performance: true,
              },
              extra: {
                value,
                threshold,
                delta: value - threshold,
                id,
              },
            });
          }
        };

        // Register all Web Vitals metrics
        onCLS(reportWebVitals);
        onFCP(reportWebVitals);
        onINP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
      })
      .catch((error) => {
        console.error('Failed to load web-vitals:', error);
        Sentry.captureException(error, {
          tags: {
            component: 'WebVitals',
            error_type: 'import_failure',
          },
        });
      });
  }, []);

  return null;
}
