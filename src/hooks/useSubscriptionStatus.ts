import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import type { SubscriptionStatus } from './useSubscription';

const API_URL = import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/subscription/check?id=${user.id}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: SubscriptionStatus = await res.json();
        setSubscription(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, loading, error };
}
