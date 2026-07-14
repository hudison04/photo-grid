import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { LOGIN_PATH } from '@/config/subscriptionRoutes.js';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initialLoading } = useAuth();

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  return children;
}