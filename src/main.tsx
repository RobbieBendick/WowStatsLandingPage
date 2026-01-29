import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BindRoutes } from './bind-routes.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <AuthProvider>
      <BindRoutes />
    </AuthProvider>
  </StrictMode>,
);
