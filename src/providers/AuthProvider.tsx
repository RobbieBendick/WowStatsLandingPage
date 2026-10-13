import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  getCurrentUser,
  getSessionToken,
  refreshSession,
  SESSION_REFRESH_MS,
  clearUser,
} from '../utils/auth';
import type { DiscordUser } from '../utils/auth';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

interface AuthContextType {
  user: DiscordUser | null;
  isLoading: boolean;
  signInWithDiscord: () => void;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);

    const syncSession = async (isInitial: boolean) => {
      const result = await refreshSession();
      lastRefreshAtRef.current = Date.now();
      if (result === 'expired') {
        setUser(null);
      } else {
        setUser(getCurrentUser());
      }
      if (isInitial) {
        setIsLoading(false);
      }
    };

    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('userAuthChange', handleAuthChange);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'discord_user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const onExpired = () => {
      setUser(null);
    };
    window.addEventListener('sessionExpired', onExpired);

    const interval = window.setInterval(() => {
      if (getCurrentUser() || getSessionToken()) {
        syncSession(false);
      }
    }, SESSION_REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastRefreshAtRef.current < SESSION_REFRESH_MS / 2) return;
      if (getCurrentUser() || getSessionToken()) {
        syncSession(false);
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    if (!storedUser && !getSessionToken()) {
      setIsLoading(false);
    } else {
      syncSession(true);
    }

    return () => {
      window.removeEventListener('userAuthChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionExpired', onExpired);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, []);

  const signInWithDiscord = () => {
    setError(null);
    window.location.href = `${API_URL}/api/auth/discord?client=web`;
  };

  const signOut = () => {
    setError(null);
    clearUser();
    setUser(null);
    window.dispatchEvent(new Event('userAuthChange'));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signInWithDiscord,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
