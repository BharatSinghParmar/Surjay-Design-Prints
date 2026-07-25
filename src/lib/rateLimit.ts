import "server-only";
import {
  PG_ENABLED,
  pgCountAttempts,
  pgRecordAttempt,
  pgClearAttempts,
  pgRetryAfter
} from "@/lib/designs/pgStore";

/**
 * Rate limiting for sign-in attempts.
 *
 * Backed by the database when one is configured. An in-process counter is not
 * enough on a serverless host: each invocation may run on a different instance,
 * so every request sees an empty bucket and nothing is ever blocked. Verified
 * against production — the in-memory version let 8 consecutive bad passwords
 * through untouched.
 *
 * Falls back to in-memory for local development, where there is a single process.
 */

type Options = { limit: number; windowMs: number };
type Result = { allowed: boolean; retryAfterSeconds: number };

const buckets = new Map<string, number[]>();

function memoryCheck(key: string, { limit, windowMs }: Options): Result {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  buckets.set(key, recent);
  if (recent.length >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000))
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Is this key currently over its limit? Does not record anything. */
export async function checkRateLimit(key: string, opts: Options): Promise<Result> {
  if (PG_ENABLED) {
    try {
      const count = await pgCountAttempts(key, opts.windowMs);
      if (count >= opts.limit) {
        return { allowed: false, retryAfterSeconds: await pgRetryAfter(key, opts.windowMs) };
      }
      return { allowed: true, retryAfterSeconds: 0 };
    } catch (err) {
      // Never lock anyone out because the database hiccuped.
      console.error("[rateLimit] database check failed, falling back to memory", err);
    }
  }
  return memoryCheck(key, opts);
}

/** Record one failed attempt against a key. */
export async function recordFailure(key: string, opts: Options): Promise<void> {
  if (PG_ENABLED) {
    try {
      await pgRecordAttempt(key);
      return;
    } catch (err) {
      console.error("[rateLimit] could not record attempt", err);
    }
  }
  const recent = buckets.get(key) ?? [];
  recent.push(Date.now());
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
}

/** Clear a key's history — called after a successful sign-in. */
export async function clearAttempts(key: string): Promise<void> {
  if (PG_ENABLED) {
    try {
      await pgClearAttempts(key);
      return;
    } catch (err) {
      console.error("[rateLimit] could not clear attempts", err);
    }
  }
  buckets.delete(key);
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
