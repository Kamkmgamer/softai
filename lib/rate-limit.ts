// In-memory rate limiter. Works for single-instance deployments (single server or
// serverless with a single isolate). In horizontal-scale setups (multiple instances,
// edge functions), replace the Map with Redis or KV for a shared store.
type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitConfig = {
  windowMs: number;
  max: number;
};

const store = new Map<string, RateLimitEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    cleanup();
  }
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; retryAfterMs: number; remaining: number; resetMs: number } {
  maybeCleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, retryAfterMs: 0, remaining: config.max - 1, resetMs: config.windowMs };
  }

  entry.count += 1;
  const remaining = Math.max(0, config.max - entry.count);
  const resetMs = entry.resetAt - now;

  if (entry.count > config.max) {
    return { allowed: false, retryAfterMs: resetMs, remaining: 0, resetMs };
  }

  return { allowed: true, retryAfterMs: 0, remaining, resetMs };
}

export function rateLimitResetSeconds(resetMs: number): number {
  return Math.ceil((Date.now() + resetMs) / 1000);
}

export const READ_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60_000,
  max: 60,
};

export const WRITE_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60_000,
  max: 30,
};
