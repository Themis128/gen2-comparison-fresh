// Analytics utility for tracking custom events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    const windowWithGtag = window as { gtag?: (...args: unknown[]) => void };
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', eventName, parameters);
    }
  }
};

// Track page views (automatically handled by Google Analytics, but good to have)
export const trackPageView = (pagePath: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
  });
};

// Track user interactions
export const trackInteraction = (action: string, category: string, label?: string) => {
  trackEvent(action, {
    event_category: category,
    event_label: label,
  });
};

// Track contact form submissions
export const trackContactSubmission = () => {
  trackEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: 'contact_form',
  });
};

// Track project views
export const trackProjectView = (projectName: string) => {
  trackEvent('project_view', {
    event_category: 'engagement',
    event_label: projectName,
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', {
    event_category: 'engagement',
    event_label: platform,
  });
};

// Track download events
export const trackDownload = (fileName: string) => {
  trackEvent('file_download', {
    event_category: 'engagement',
    event_label: fileName,
  });
};

// Lambda-based analytics tracking (server-side) - NOW IMPLEMENTED
export const trackAnalyticsEvent = async (
  eventType: string,
  page?: string,
  metadata?: Record<string, unknown>
) => {
  try {
    // Dynamic import to avoid issues in server-side rendering
    const { generateClient } = await import('@aws-amplify/api');
    const client = generateClient();

    await client.graphql({
      query: `
        mutation TrackAnalytics($eventType: String!, $page: String, $userAgent: String, $referrer: String, $metadata: AWSJSON) {
          trackAnalytics(eventType: $eventType, page: $page, userAgent: $userAgent, referrer: $referrer, metadata: $metadata)
        }
      `,
      variables: {
        eventType,
        page: page || (typeof window !== 'undefined' ? window.location.pathname : undefined),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        metadata,
      },
    });
  } catch (error) {
    console.warn('Lambda analytics tracking failed:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
};
