import { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app';

export function SettingsPage() {
  const { user, subscriptionStatus, isLoading, refresh } = useSubscription();
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!user) {
    return <div>Please log in to view settings.</div>;
  }

  if (isLoading) {
    return <div>Loading subscription info...</div>;
  }

  const handleUnsubscribe = () => {
    setConfirmOpen(true);
  };

  const confirmHandler = async (confirmed: boolean) => {
    setConfirmOpen(false);

    if (!confirmed) return;

    const userId = subscriptionStatus?.user_id ?? user.id;
    if (!userId) {
      setError('No user ID found.');
      return;
    }

    setIsUnsubscribing(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/subscription/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to unsubscribe.');
      }

      await refresh();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const isComped =
    subscriptionStatus?.comped_until != null &&
    new Date(subscriptionStatus.comped_until) > new Date();
  const isCancelAtPeriodEnd = subscriptionStatus?.cancel_at_period_end === true;
  const isInactive =
    !subscriptionStatus ||
    (subscriptionStatus.status !== 'active' &&
      subscriptionStatus.status !== 'trialing');
  const isDisabled =
    isUnsubscribing || isCancelAtPeriodEnd || isComped || isInactive;

  return (
    <div className='unsubscribe-section'>
      <h2>
        <span className='gradient-text'>WoWStats</span> Pro Subscription
      </h2>

      <div className='subscription-info'>
        <p>
          Status:{' '}
          <strong>
            {subscriptionStatus?.status === 'active' ||
            subscriptionStatus?.status === 'comped' ||
            subscriptionStatus?.status === 'trialing'
              ? isCancelAtPeriodEnd
                ? 'Cancelling'
                : 'Active'
              : 'Inactive'}
          </strong>
        </p>

        {subscriptionStatus?.current_period_end && (
          <p>
            Pro access ends on:{' '}
            {new Date(
              subscriptionStatus.current_period_end
            ).toLocaleDateString()}
          </p>
        )}

        <button
          type='button'
          className='unsubscribe-button'
          onClick={handleUnsubscribe}
          disabled={isDisabled}
        >
          {isUnsubscribing
            ? 'Unsubscribing...'
            : isCancelAtPeriodEnd
            ? 'Subscription Cancelled'
            : isInactive
            ? 'Not subscribed'
            : 'Unsubscribe'}
        </button>

        {isComped ? (
          <p className='status-note'>
            You are currently on a{' '}
            <strong>complimentary Pro subscription</strong>. This access is
            granted by an administrator and cannot be cancelled from your
            account.
          </p>
        ) : (
          isCancelAtPeriodEnd && (
            <p className='status-note'>
              Your subscription has been cancelled and will remain active until{' '}
              <strong>
                {subscriptionStatus?.current_period_end
                  ? new Date(
                      subscriptionStatus.current_period_end
                    ).toLocaleDateString()
                  : 'the end of your billing period'}
              </strong>
              . You will keep Pro access until that date.
            </p>
          )
        )}

        {error && (
          <p className='message' style={{ color: 'var(--error, #f44336)' }}>
            {error}
          </p>
        )}
      </div>

      {confirmOpen && (
        <div className='dialog-backdrop' onClick={() => confirmHandler(false)}>
          <div className='dialog' onClick={e => e.stopPropagation()}>
            <h3>Confirm Cancellation</h3>
            <p>
              Are you sure you want to unsubscribe? This will stop recurring
              billing, but you will keep Pro access until your subscription
              period ends.
            </p>

            <div className='dialog-buttons'>
              <button
                type='button'
                className='dialog-button cancel'
                onClick={() => confirmHandler(false)}
              >
                Cancel
              </button>
              <button
                type='button'
                className='dialog-button confirm'
                onClick={() => confirmHandler(true)}
                disabled={isUnsubscribing}
              >
                Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
