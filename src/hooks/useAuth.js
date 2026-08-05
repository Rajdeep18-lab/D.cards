import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      profile: null,
      loading: false,
      isEmailVerified: false,
      isFirstLogin: false,
      isAuthModalOpen: false,
      setIsAuthModalOpen: () => {},
      authModalInitialTab: "login",
      openAuthModal: () => {},
      signUp: async () => {},
      login: async () => {},
      logout: async () => {},
      updateProfile: async () => {},
      updateEmail: async () => {},
      updatePassword: async () => {},
      redirectTarget: null,
      setRedirectTarget: () => {},
      isPasswordRecoveryActive: false,
      setIsPasswordRecoveryActive: () => {}
    };
  }
  return context;
}
