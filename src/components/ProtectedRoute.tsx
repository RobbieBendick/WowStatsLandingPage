import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Optional: render a loading state while checking auth
  if (isLoading) return <div>Loading...</div>;

  // If no user, redirect to home or login
  if (!user) return <Navigate to="/" replace />;

  // Otherwise, render the children
  return <>{children}</>;
}
