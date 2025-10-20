// Google Analytics 4 Event Tracking Utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Send a page view event to GA4
 */
export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

/**
 * Send a custom event to GA4
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track form submission
 */
export const trackFormSubmit = (formName: string) => {
  event({
    action: "form_submit",
    category: "engagement",
    label: formName,
  });
};

/**
 * Track CTA button click
 */
export const trackCTAClick = (ctaName: string, location: string) => {
  event({
    action: "cta_click",
    category: "engagement",
    label: `${ctaName} - ${location}`,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number) => {
  event({
    action: "scroll",
    category: "engagement",
    label: `${depth}%`,
    value: depth,
  });
};

/**
 * Track language change
 */
export const trackLanguageChange = (from: string, to: string) => {
  event({
    action: "language_change",
    category: "engagement",
    label: `${from} → ${to}`,
  });
};

/**
 * Track theme change
 */
export const trackThemeChange = (theme: string) => {
  event({
    action: "theme_change",
    category: "engagement",
    label: theme,
  });
};
