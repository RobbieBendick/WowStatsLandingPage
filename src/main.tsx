import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BindRoutes } from './bind-routes.tsx';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BindRoutes />
  </StrictMode>,
);
