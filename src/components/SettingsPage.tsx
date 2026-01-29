import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { useAuth } from '../providers/AuthProvider';
import { useSubscriptionStatus } from '../hooks/useSubscriptionStatus';

const API_URL = import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

export function SettingsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();
  const { subscription, loading, error } = useSubscriptionStatus();
  if (!user) return <div>Please log in to view settings.</div>;


  if (loading) return <div>Loading subscription info...</div>;
  if (error) return <div>Error loading subscription: {error}</div>;

  const handleUnsubscribe = async () => {
    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch(`${API_URL}/api/subscription/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      console.log('Unsubscribe response:', data);

      setMessage('You have successfully unsubscribed.');
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setMessage('Failed to unsubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="unsubscribe-section">
      <h2>Unsubscribe from WoWStats Pro</h2>
      <p>If you unsubscribe, you will lose access to premium features.</p>
      <button
        className="unsubscribe-button"
        onClick={() => setDialogOpen(true)}
        disabled={isLoading}
      >
        Unsubscribe
      </button>
      <div>
      <h2>Settings</h2>
      <p>User: {user.username}</p>

      <h3>Subscription Status</h3>
      <p>Active: {subscription?.active ? 'Yes' : 'No'}</p>
      <p>Status: {subscription?.status}</p>
      {subscription?.current_period_end && (
        <p>
          Current period ends: {new Date(subscription.current_period_end).toLocaleDateString()}
        </p>
      )}
      {subscription?.cancel_at_period_end && <p>Subscription will cancel at period end.</p>}
      {subscription?.cancellation_date && (
        <p>
          Cancellation requested: {new Date(subscription.cancellation_date).toLocaleDateString()}
        </p>
      )}
    </div>
      {message && <p className="message">{message}</p>}

      {isDialogOpen && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Confirm Unsubscribe</h3>
            <p>Are you sure you want to unsubscribe?</p>
            <div className="dialog-buttons">
              <button
                className="dialog-button confirm"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                Yes, unsubscribe
              </button>
              <button
                className="dialog-button cancel"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
