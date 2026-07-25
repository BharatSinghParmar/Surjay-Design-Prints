import "server-only";

/**
 * Small in-memory rate limiter.
 *
 * Scoped to a single warm serverless instance, so it is a speed bump rather than
 * a hard guarantee — enough to make online password guessing impractical without
 * adding external infrastructure.
 */

type Bucket = number[];
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0];
    buckets.set(key, recent);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000))
    };
  }

  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    // crude memory bound: drop everything rather than grow without limit
    buckets.clear();
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Clear a key's history, e.g. after a successful login. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
