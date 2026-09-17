import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute / AuthGuard
 * 
 * Centralized route protection guard for D.CARD.
 * - If auth is still loading (e.g. restoring session on initial load or refresh),
 *   renders an unobtrusive loading screen to prevent premature redirects.
 * - If user is unauthenticated, saves the current target URL in sessionStorage
 *   and router location state, then redirects to /login.
 * - If user is authenticated, allows access to child routes via <Outlet /> or children.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8FBFF] dark:bg-[#0F172A] select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save target path for post-authentication redirection
    const fullPath = location.pathname + (location.search || '') + (location.hash || '');
    try {
      if (fullPath && fullPath !== '/login' && fullPath !== '/signup') {
        sessionStorage.setItem('dcard_auth_redirect', fullPath);
      }
    } catch (e) {
      console.warn('sessionStorage write error:', e);
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
