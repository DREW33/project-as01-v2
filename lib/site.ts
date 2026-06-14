/*
 * Canonical site URL — used by metadata, sitemap, robots and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in Vercel env. Defaults to the live Vercel URL now;
 * change that one env var to your real domain when it's ready and everything
 * (canonical tags, sitemap, robots, schema) updates automatically.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://project-as01.vercel.app"
).replace(/\/$/, "");
