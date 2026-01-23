import { useState, useEffect } from 'react'
import { getCurrentUser, checkSubscription, refreshSubscription } from '../utils/auth'
import type { DiscordUser } from '../utils/auth'

interface UseSubscriptionReturn {
  user: DiscordUser | null
  isSubscribed: boolean
  isLoading: boolean
  refresh: () => Promise<void>
}

/**
 * Hook to manage user subscription status
 * Automatically checks subscription when user changes
 */
export function useSubscription(): UseSubscriptionReturn {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    setIsLoading(true)
    const currentUser = getCurrentUser()
    
    if (currentUser) {
      setUser(currentUser)
      // Check subscription status
      try {
        const subscribed = await checkSubscription(currentUser.id)
        setIsSubscribed(subscribed)
        // Update user if subscription status changed
        if (subscribed !== currentUser.subscribed) {
          const updatedUser = { ...currentUser, subscribed }
          setUser(updatedUser)
        }
      } catch (error) {
        console.error('Failed to check subscription:', error)
        setIsSubscribed(currentUser.subscribed || false)
      }
    } else {
      setUser(null)
      setIsSubscribed(false)
    }
    
    setIsLoading(false)
  }

  const refresh = async () => {
    if (user) {
      await refreshSubscription()
      await loadUser()
    }
  }

  useEffect(() => {
    loadUser()

    // Listen for auth changes
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
    isSubscribed,
    isLoading,
    refresh
  }
}
