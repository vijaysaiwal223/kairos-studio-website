/**
 * The site's public origin. Resolves Open Graph image paths, the sitemap and
 * robots.txt. Set NEXT_PUBLIC_SITE_URL for preview and production deploys.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Kairos Studio";
