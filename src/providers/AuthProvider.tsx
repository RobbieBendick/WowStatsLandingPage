import { createContext, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
  subscribed: boolean;
}

interface AuthContextType {
  user: DiscordUser | null;
  isLoading: boolean;
  signInWithDiscord: () => void;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage helpers
const getStoredUser = (): DiscordUser | null => {
  const userStr = localStorage.getItem('discord_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const saveUser = (user: DiscordUser) => localStorage.setItem('discord_user', JSON.stringify(user));
const clearUser = () => localStorage.removeItem('discord_user');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    if (userParam) {
      try {
        const decodedParam = decodeURIComponent(userParam);
        const userJSON = atob(decodedParam);
        const user: DiscordUser = JSON.parse(userJSON);
        saveUser(user);
        setUser(user);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Failed to parse user data from OAuth callback:', err);
        setError('Failed to parse user data');
      }
    }

    // Listen for storage changes in other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'discord_user') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(newUser);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signInWithDiscord = () => {
    setError(null);
    const oauthUrl = `${API_URL}/api/auth/discord?client=web`;
    window.location.href = oauthUrl; // Redirect to backend OAuth
  };

  const signOut = () => {
    setError(null);
    clearUser();
    setUser(null);
    window.dispatchEvent(new Event('userAuthChange'));
  };

  const value: AuthContextType = { user, isLoading, signInWithDiscord, signOut, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
