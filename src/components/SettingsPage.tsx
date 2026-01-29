import { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { getCurrentUser, type DiscordUser } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

export function SettingsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const user = getCurrentUser();
  console.log(user);
  const handleUnsubscribe = async () => {
    if (!user || !user.id) {
      console.error('No user ID found');
      return;
    }
  
    try {
      setDialogOpen(false); // close the dialog immediately
  
      const response = await fetch(`${API_URL}/api/subscription/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user?.id }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Unsubscribe response:', data);
  
      // Optionally, show a success toast or update local state
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
      // Optionally, show an error toast
    }
  };
  
  return (
    <div className="unsubscribe-section">
      <h2>Unsubscribe from WoWStats Pro</h2>
      <p>If you unsubscribe, you will lose access to premium features.</p>
      <button
        className="unsubscribe-button"
        onClick={() => setDialogOpen(true)}
      >
        Unsubscribe
      </button>

      {isDialogOpen && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Confirm Unsubscribe</h3>
            <p>Are you sure you want to unsubscribe?</p>
            <div className="dialog-buttons">
              <button
                className="dialog-button confirm"
                onClick={handleUnsubscribe}
              >
                Yes, unsubscribe
              </button>
              <button
                className="dialog-button cancel"
                onClick={() => setDialogOpen(false)}
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
