import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BindRoutes } from './bind-routes.tsx'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BindRoutes />
  </StrictMode>,
)
