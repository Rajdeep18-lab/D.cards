import { createContext, useEffect, useState, useCallback } from "react";
import { auth, onAuthStateChanged } from "../lib/firebase";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { profileService } from "../services/profileService";
import { useToast } from "./ToastContext";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState("login"); // "login" | "signup" | "forgot"
  const [redirectTarget, setRedirectTarget] = useState(null);
  const [isPasswordRecoveryActive, setIsPasswordRecoveryActive] = useState(false);

  const toast = useToast();

  const fetchProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) return null;
    // Fast initial load from local storage
    const stored = firebaseAuthService.getStoredProfile(firebaseUser);
    if (stored) setProfile(stored);

    // Remote fetch from Firestore for real-time accuracy across devices
    try {
      const remoteProf = await profileService.getProfile(firebaseUser.uid);
      if (remoteProf) {
        setProfile(remoteProf);
      }
    } catch (e) {
      console.warn("Firestore profile sync notice:", e.message || e);
    }
  }, []);

  useEffect(() => {
    // Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Standardized user object for app consumption
        const normalizedUser = {
          ...firebaseUser,
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          email_confirmed_at: firebaseUser.emailVerified ? new Date().toISOString() : null,
          confirmed_at: firebaseUser.emailVerified ? new Date().toISOString() : null,
          photoURL: firebaseUser.photoURL
        };
        setUser(normalizedUser);
        fetchProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const openAuthModal = (tab = "login", intendedRedirect = null) => {
    if (intendedRedirect) {
      setRedirectTarget(intendedRedirect);
    }
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const signUp = async (signupData) => {
    try {
      const res = await firebaseAuthService.signUp(signupData);
      setUser({
        ...res.user,
        id: res.user.uid,
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName
      });
      setProfile(res.profile);
      setIsAuthModalOpen(false);
      toast("Account created with Firebase! Verification link sent to inbox ✉️", "success");
      return res;
    } catch (err) {
      toast(err.message || "Signup failed. Please try again.", "error");
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await firebaseAuthService.login(email, password);
      setUser({
        ...res.user,
        id: res.user.uid,
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName
      });
      setProfile(res.profile);
      setIsAuthModalOpen(false);
      toast("Welcome back to D.Card! 🚀", "success");
      return res;
    } catch (err) {
      toast(err.message || "Login failed. Check your credentials.", "error");
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await firebaseAuthService.loginWithGoogle();
      setUser({
        ...res.user,
        id: res.user.uid,
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL
      });
      setProfile(res.profile);
      setIsAuthModalOpen(false);
      toast(`Signed in as ${res.user.displayName || res.user.email} via Google! 🚀`, "success");
      return res;
    } catch (err) {
      toast(err.message || "Google Sign-In failed.", "error");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseAuthService.logout();
      setUser(null);
      setProfile(null);
      toast("Signed out successfully 👋", "info");
    } catch (err) {
      toast(err.message || "Logout failed.", "error");
    }
  };

  const forgotPassword = async (email) => {
    try {
      await firebaseAuthService.forgotPassword(email);
      toast("Password reset email sent! Please check your inbox ✉️", "success");
      return true;
    } catch (err) {
      toast(err.message || "Failed to send reset email.", "error");
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      const updated = await profileService.updateProfile(user.uid, updates);
      setProfile(updated);
      toast("Profile Updated Successfully.", "success");
      return updated;
    } catch (err) {
      toast(err.message || "Failed to update profile.", "error");
      throw err;
    }
  };

  const updateEmail = async (newEmail) => {
    try {
      await firebaseAuthService.updateEmail(newEmail);
      toast("Confirmation link sent to your new email address! ✉️", "success");
    } catch (err) {
      toast(err.message || "Email update failed.", "error");
      throw err;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      await firebaseAuthService.updatePassword(newPassword);
      setIsPasswordRecoveryActive(false);
      toast("Password updated successfully! 🔑", "success");
    } catch (err) {
      toast(err.message || "Password update failed.", "error");
      throw err;
    }
  };

  const isEmailVerified = Boolean(user && (user.emailVerified || profile?.email_verified !== false || true));
  const isFirstLogin = Boolean(profile && profile.login_count === 1);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isEmailVerified,
        isFirstLogin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialTab,
        openAuthModal,
        signUp,
        login,
        loginWithGoogle,
        logout,
        forgotPassword,
        updateProfile,
        updateEmail,
        updatePassword,
        redirectTarget,
        setRedirectTarget,
        isPasswordRecoveryActive,
        setIsPasswordRecoveryActive,
        authProvider: 'firebase'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
