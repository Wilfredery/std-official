export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shinetechdata.com";

export const locales = ["en", "es"] as const;

/** Stable `@id` of the business entity, referenced by Service/BlogPosting JSON-LD. */
export const ORG_ID = `${SITE_URL}/#organization`;

/** Stable `@id` of the WebSite entity. */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Markets the business serves (schema.org `areaServed`). */
export const AREA_SERVED = ["Dominican Republic", "United States", "Latin America"];

/**
 * Last meaningful content edit of static + service pages (YYYY-MM-DD).
 * Bump only when page copy actually changes — a build-time date on every
 * URL teaches Google to ignore `lastmod`.
 */
export const PAGES_UPDATED_AT = "2026-11-15";

/** Public booking link for free 30-min consultations. */
export const BOOKING_URL = "https://calendly.com/cacasicaxxxx/30min";
