const API_URL =
  import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app'
  console.log('AUTH FILE PATH:', import.meta.url)
export interface DiscordUser {
  id: string
  username: string
  email: string
  avatar?: string
  // Cached UI state only – real truth comes from Stripe
  subscribed: boolean
}

/* =========================
   Local user helpers
========================= */

// Get cached user
export const getCurrentUser = (): DiscordUser | null => {
  const userStr = localStorage.getItem('discord_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Save cached user
export const saveUser = (user: DiscordUser) => {
  localStorage.setItem('discord_user', JSON.stringify(user))
}

// Clear cached user
export const clearUser = () => {
  localStorage.removeItem('discord_user')
}

/* =========================
   Auth
========================= */

// Start Discord OAuth
export const loginWithDiscord = () => {
  window.location.href = `${API_URL}/api/auth/discord`
}

/* =========================
   Subscription
========================= */

// Always check backend (Stripe-backed)
export const checkSubscription = async (
  userId: string
): Promise<boolean> => {
  try {
    const res = await fetch(
      `${API_URL}/api/subscription/check?id=${userId}`
    )
    console.log('ello')
    if (!res.ok) return false

    const data = await res.json()
    console.log('data', data)

    return Boolean(data.stripe_status === 'active')
  } catch (err) {
    console.error('Subscription check failed:', err)
    return false
  }
}

// Re-sync local cache with backend truth
export const refreshSubscription = async (): Promise<boolean> => {
  const user = getCurrentUser()
  if (!user) return false

  const isSubscribed = await checkSubscription(user.id)

  // Update cache only if changed
  if (user.subscribed !== isSubscribed) {
    saveUser({
      ...user,
      subscribed: isSubscribed,
    })

    // Notify app (navbar, paywall, etc)
    window.dispatchEvent(new Event('userAuthChange'))
  }

  return isSubscribed
}
