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

// Check subscription status
export const checkSubscription = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/user?id=${userId}`)
    if (!response.ok) return false
    
    const user = await response.json()
    return user.subscribed || false
  } catch {
    return false
  }
}