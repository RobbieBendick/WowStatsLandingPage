import { authFetch } from './auth';

/** Cache subscription result per user to avoid repeated backend calls. Persists in localStorage so it survives full page refresh. */
const SUBSCRIPTION_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day
const STORAGE_KEY_PREFIX = 'wowstats_subscription_';

export interface SubscriptionStatus {
  active: boolean;
  user_id: string;
  status: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  cancellation_date?: string;
  stripe_subscription_id?: string;
  comped_until?: string;
}

interface CachedSubscription {
  status: SubscriptionStatus;
  fetchedAt: number;
}

// In-memory cache for the current session (avoids reading localStorage on every call)
const memoryCache = new Map<string, CachedSubscription>();

function storageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function getCachedSubscription(userId: string): SubscriptionStatus | null {
  const fromMemory = memoryCache.get(userId);
  if (fromMemory) {
    if (Date.now() - fromMemory.fetchedAt > SUBSCRIPTION_CACHE_TTL_MS) {
      memoryCache.delete(userId);
      try {
        localStorage.removeItem(storageKey(userId));
      } catch {
        // ignore
      }
      return null;
    }
    return fromMemory.status;
  }

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const cached: CachedSubscription = JSON.parse(raw);
    if (!cached?.status || typeof cached.fetchedAt !== 'number') return null;
    if (Date.now() - cached.fetchedAt > SUBSCRIPTION_CACHE_TTL_MS) {
      localStorage.removeItem(storageKey(userId));
      return null;
    }
    memoryCache.set(userId, cached);
    return cached.status;
  } catch {
    return null;
  }
}

function setCachedSubscription(
  userId: string,
  status: SubscriptionStatus,
): void {
  const entry: CachedSubscription = { status, fetchedAt: Date.now() };
  memoryCache.set(userId, entry);
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(entry));
  } catch {
    // quota or private mode; in-memory cache still works for this session
  }
}

function clearCachedSubscription(userId: string): void {
  memoryCache.delete(userId);
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    // ignore
  }
}

/**
 * Fetch subscription status for a user. Uses cache (1-day TTL, persisted in localStorage) unless
 * forceRefresh is true (e.g. after checkout or explicit refresh).
 */
export async function fetchSubscriptionStatus(
  userId: string,
  options?: { forceRefresh?: boolean },
): Promise<SubscriptionStatus | null> {
  if (!options?.forceRefresh) {
    const cached = getCachedSubscription(userId);
    if (cached) return cached;
  } else {
    clearCachedSubscription(userId);
  }

  const API_URL =
    import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

  try {
    const res = await authFetch(`${API_URL}/api/subscription/check`);
    if (!res.ok) return null;
    const status: SubscriptionStatus = await res.json();
    if (status && typeof status === 'object' && status.user_id) {
      setCachedSubscription(status.user_id, status);
    }
    return status;
  } catch (err) {
    console.error('Subscription check failed:', err);
    return null;
  }
}
