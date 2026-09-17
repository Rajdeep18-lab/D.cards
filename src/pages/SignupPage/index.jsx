import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';

/**
 * SignupPage route component.
 * If user is already authenticated, redirects them to their intended destination or home.
 */
export default function SignupPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const fromState = location.state?.from;
      let target = '/';
      if (fromState?.pathname) {
        target = fromState.pathname + (fromState.search || '') + (fromState.hash || '');
      } else if (typeof fromState === 'string' && fromState !== '/login' && fromState !== '/signup') {
        target = fromState;
      } else {
        try {
          const saved = sessionStorage.getItem('dcard_auth_redirect');
          if (saved && saved !== '/login' && saved !== '/signup') {
            target = saved;
            sessionStorage.removeItem('dcard_auth_redirect');
          }
        } catch (e) {
          // ignore
        }
      }
      navigate(target, { replace: true });
    }
  }, [user, loading, navigate, location]);

  return (
    <AuthLayout mode="signup">
      <SignupForm />
    </AuthLayout>
  );
}
