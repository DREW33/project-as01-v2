/*
 * Lightweight in-memory rate limiter (per IP, per route).
 * Shields public endpoints from spam / brute-force / AI-quota draining.
 * Note: serverless instances each hold their own window, so this is a
 * practical speed-bump, not a hard guarantee — good enough to stop abuse.
 */
type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * @returns true if the request is allowed, false if it exceeded the limit.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hit = buckets.get(key);
  if (!hit || now > hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (hit.count >= limit) return false;
  hit.count += 1;
  return true;
}

/** Convenience: build a key from route name + IP. */
export function limited(req: Request, route: string, limit: number, windowMs: number): boolean {
  return !rateLimit(`${route}:${clientIp(req)}`, limit, windowMs);
}
