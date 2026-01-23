const API_URL = import.meta.env.VITE_API_URL || 'https://wowstats-backend.vercel.app'

export interface DiscordUser {
  id: string
  username: string
  email: string
  subscribed: boolean
}

// Check if user is logged in (has user data in localStorage)
export const getCurrentUser = (): DiscordUser | null => {
  const userStr = localStorage.getItem('discord_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Save user data after Discord OAuth
export const saveUser = (user: DiscordUser) => {
  localStorage.setItem('discord_user', JSON.stringify(user))
}

// Clear user data (logout)
export const clearUser = () => {
  localStorage.removeItem('discord_user')
}

// Initiate Discord OAuth
export const loginWithDiscord = () => {
  window.location.href = `${API_URL}/api/auth/discord`
}

// Check subscription status using the subscription check endpoint
export const checkSubscription = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/subscription/check?id=${userId}`)
    if (!response.ok) {
      // Fallback to user endpoint if subscription check fails
      const userResponse = await fetch(`${API_URL}/api/user?id=${userId}`)
      if (!userResponse.ok) return false
      const user = await userResponse.json()
      return user.subscribed || false
    }
    
    const status = await response.json()
    return status.subscribed || status.has_active || false
  } catch (error) {
    console.error('Failed to check subscription:', error)
    // Fallback: check cached user data
    const user = getCurrentUser()
    return user?.subscribed || false
  }
}

// Refresh subscription status for current user
export const refreshSubscription = async (): Promise<boolean> => {
  const user = getCurrentUser()
  if (!user) return false
  
  const isSubscribed = await checkSubscription(user.id)
  if (isSubscribed !== user.subscribed) {
    const updatedUser = { ...user, subscribed: isSubscribed }
    saveUser(updatedUser)
    // Dispatch event to update all components
    window.dispatchEvent(new Event('userAuthChange'))
  }
  return isSubscribed
}