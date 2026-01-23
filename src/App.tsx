import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import Features from './components/Features'
import About from './components/About'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { saveUser, getCurrentUser, checkSubscription } from './utils/auth'
import type { DiscordUser } from './utils/auth'
import './style.css'

function App() {
  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const userParam = urlParams.get('user')
    
    if (userParam) {
      try {
        // Decode base64 user data
        const userJSON = atob(userParam)
        const user: DiscordUser = JSON.parse(userJSON)
        
        // Check subscription status
        checkSubscription(user.id).then(isSubscribed => {
          const userWithSubscription = { ...user, subscribed: isSubscribed }
          saveUser(userWithSubscription)
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
          
          // Dispatch event to update all components
          window.dispatchEvent(new Event('userAuthChange'))
          
          // Reload to update UI
          window.location.reload()
        })
      } catch (error) {
        console.error('Failed to parse user data from callback:', error)
      }
    } else {
      // Check if user is already logged in and refresh subscription status
      const currentUser = getCurrentUser()
      if (currentUser) {
        checkSubscription(currentUser.id).then(isSubscribed => {
          if (isSubscribed !== currentUser.subscribed) {
            const updatedUser = { ...currentUser, subscribed: isSubscribed }
            saveUser(updatedUser)
          }
        })
      }
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Features />
        <About />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
