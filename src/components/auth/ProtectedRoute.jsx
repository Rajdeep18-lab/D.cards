import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute / AuthGuard
 * 
 * Centralized route protection guard for D.CARD.
 * - When user is authenticated: renders child route via <Outlet /> or children.
 * - When user is unauthenticated:
 *   - Does NOT redirect to a separate full-page login screen.
 *   - Remembers the requested target URL for seamless post-login navigation.
 *   - Automatically triggers the centered <AuthModal />.
 *   - Keeps underlying D.CARD interface mounted and visible behind the modal.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const fullPath = location.pathname + (location.search || '') + (location.hash || '');
      try {
        if (fullPath && fullPath !== '/login' && fullPath !== '/signup') {
          sessionStorage.setItem('dcard_auth_redirect', fullPath);
        }
      } catch (e) {
        console.warn('sessionStorage write error:', e);
      }
      openAuthModal('login', fullPath);
    }
  }, [loading, user, location, openAuthModal]);

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

  // If user is not authenticated, render underlying content (with disabled interaction)
  // so the D.CARD website remains visible behind the modal popup.
  if (!user) {
    return (
      <div className="pointer-events-none select-none opacity-80 filter blur-[0.5px]">
        {children ? children : <Outlet />}
      </div>
    );
  }

  return children ? children : <Outlet />;
}
