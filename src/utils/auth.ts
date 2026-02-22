const API_URL =
  import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';
export interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  // Cached UI state only – real truth comes from Stripe
  subscribed: boolean;
}

const SESSION_TOKEN_KEY = 'wowstats_session_token';

/* =========================
   Local user helpers
========================= */

// Get cached user
export const getCurrentUser = (): DiscordUser | null => {
  const userStr = localStorage.getItem('discord_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Save cached user
export const saveUser = (user: DiscordUser) => {
  localStorage.setItem('discord_user', JSON.stringify(user));
};

// Clear cached user
export const clearUser = () => {
  localStorage.removeItem('discord_user');
  localStorage.removeItem(SESSION_TOKEN_KEY);
};

export const getSessionToken = (): string | null =>
  localStorage.getItem(SESSION_TOKEN_KEY);
const saveSessionToken = (token: string) =>
  localStorage.setItem(SESSION_TOKEN_KEY, token);

/** Fetch with session (cookie or Bearer token) for authenticated API calls. */
export function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = getSessionToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(url, { ...init, credentials: 'include', headers });
}

/* =========================
   Auth
========================= */

// Start Discord OAuth
export const loginWithDiscord = () => {
  window.location.href = `${API_URL}/api/auth/discord?client=web`;
};

/** Exchange one-time ?code= from OAuth redirect for session and user. Returns true on success. */
export const exchangeCodeAndSaveUser = async (code: string): Promise<boolean> => {
  // Use /api/auth/exchange (Vercel rewrites to session?__route=exchange; query is preserved)
  const url = `${API_URL}/api/auth/exchange?code=${encodeURIComponent(code)}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[auth] exchange failed', res.status, res.statusText, text);
      return false;
    }
    const data = await res.json();
    const u = data.user;
    if (!u?.id) {
      console.error('[auth] exchange response missing user', data);
      return false;
    }
    saveUser({
      id: u.id,
      username: u.username ?? '',
      email: u.email ?? '',
      avatar: u.avatar,
      subscribed: false,
    });
    if (data.session_token) saveSessionToken(data.session_token);
    return true;
  } catch (err) {
    console.error('[auth] exchange error', err);
    return false;
  }
};

/* =========================
   Subscription
========================= */

interface SubscriptionStatus {
  active: boolean;
  user_id: string;
  status: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  cancellation_date?: string;
  stripe_subscription_id?: string;
}

// Check subscription from backend (uses session cookie or Bearer token)
export const checkSubscription = async (_userId?: string): Promise<boolean> => {
  try {
    const res = await authFetch(`${API_URL}/api/subscription/check`);

    if (!res.ok) {
      console.error('Subscription check failed:', await res.text());
      return false;
    }

    const data: SubscriptionStatus = await res.json();

    // active is already computed by backend
    return Boolean(
      data.status === 'active' ||
      data.status === 'trialing' ||
      data.status === 'comped',
    );
  } catch (err) {
    console.error('Subscription check failed:', err);
    return false;
  }
};

// Re-sync local cache with backend truth
export const refreshSubscription = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user) return false;

  const isSubscribed = await checkSubscription(user.id);

  // Update cache only if changed
  if (user.subscribed !== isSubscribed) {
    saveUser({
      ...user,
      subscribed: isSubscribed,
    });

    // Notify app (navbar, paywall, etc)
    window.dispatchEvent(new Event('userAuthChange'));
  }

  return isSubscribed;
};
