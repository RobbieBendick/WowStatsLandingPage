import { useState, useEffect } from 'react'
import { getCurrentUser, authFetch } from '../utils/auth'
import type { DiscordUser } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app'

export interface SubscriptionStatus {
  active: boolean
  user_id: string
  status: string
  stripe_subscription_id?: string
  cancel_at_period_end: boolean
  cancellation_date?: string
  current_period_end?: string
  comped_until?: string
}

interface UseSubscriptionReturn {
  user: DiscordUser | null
  subscriptionStatus: SubscriptionStatus | null
  isSubscribed: boolean
  isLoading: boolean
  refresh: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    setIsLoading(true)
    const currentUser = getCurrentUser()

    if (currentUser) {
      setUser(currentUser)

      try {
        // Fetch subscription status from backend (cookie or Bearer)
        const res = await authFetch(`${API_URL}/api/subscription/check`)
        if (!res.ok) throw new Error(`Failed to check subscription: ${res.statusText}`)

        const status: SubscriptionStatus = await res.json()
        setSubscriptionStatus(status)

        const now = new Date()
        const periodEnd = status.current_period_end ? new Date(status.current_period_end) : null
        const compedUntil = status.comped_until ? new Date(status.comped_until) : null

        const active =
          status.status === 'active' ||
          (status.status === 'comped' && compedUntil && compedUntil > now) ||
          (status.status === 'trialing' && periodEnd && periodEnd > now)

        setIsSubscribed(active ? true : false)

        // Optionally update the user object if subscription changed
        if (active !== currentUser.subscribed) {
          setUser({ ...currentUser, subscribed: active ? true : false })
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err)
        setSubscriptionStatus(null)
        setIsSubscribed(false)
      }
    } else {
      setUser(null)
      setSubscriptionStatus(null)
      setIsSubscribed(false)
    }

    setIsLoading(false)
  }

  const refresh = async () => {
    await loadUser()
  }

  useEffect(() => {
    loadUser()

    const handleAuthChange = () => {
      loadUser()
    }

    window.addEventListener('userAuthChange', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('userAuthChange', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  return {
    user,
    subscriptionStatus,
    isSubscribed,
    isLoading,
    refresh
  }
}
