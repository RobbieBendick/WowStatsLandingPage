import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import Features from './components/Features'
import About from './components/About'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { saveUser, refreshSubscription } from './utils/auth'
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
        
        // Save user first
        saveUser(user)
        
        // Refresh subscription status (will update user in localStorage)
        refreshSubscription().then(() => {
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
          
          // Dispatch event to update all components
          window.dispatchEvent(new Event('userAuthChange'))
        })
      } catch (error) {
        console.error('Failed to parse user data from callback:', error)
      }
    } else {
      // Check if user is already logged in and refresh subscription status
      refreshSubscription()
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
