import {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  firebaseUpdateProfile,
  firebaseUpdateEmail,
  firebaseUpdatePassword
} from '../lib/firebase';

// Active in-flight Google Sign-In promise to debounce rapid taps and prevent auth/cancelled-popup-request
let activeGoogleSignInPromise = null;

export const firebaseAuthService = {
  /**
   * Register a new user with Firebase Authentication
   */
  async signUp({ email, password, fullName, phone, country = 'India', state, city, profileImage, userType = 'Working Professional' }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Display Name
      if (fullName) {
        await firebaseUpdateProfile(user, { displayName: fullName });
      }

      // Send verification email
      try {
        await sendEmailVerification(user);
      } catch (e) {
        console.warn('Verification email notice:', e.message);
      }

      const createdAtTimestamp = new Date().toISOString();

      // Save user profile metadata in Firestore collection "users" (Requirement 1)
      const userData = {
        uid: user.uid,
        name: fullName || user.displayName || 'User',
        email: user.email,
        city: city || '',
        state: state || '',
        profileImage: profileImage || user.photoURL || '',
        createdAt: createdAtTimestamp
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        await setDoc(doc(db, 'profiles', user.uid), {
          ...userData,
          id: user.uid,
          full_name: fullName || user.displayName || 'User',
          phone: phone || '',
          country,
          user_type: userType,
          email_verified: user.emailVerified,
          created_at: createdAtTimestamp,
          auth_provider: 'firebase'
        }, { merge: true });
      } catch (err) {
        console.warn('[Firestore users collection save warning]:', err.message);
      }

      // Save user profile metadata to localStorage for persistence
      const profileData = {
        id: user.uid,
        uid: user.uid,
        email: user.email,
        full_name: fullName || user.displayName || 'User',
        name: fullName || user.displayName || 'User',
        phone: phone || '',
        country,
        state: state || '',
        city: city || '',
        profileImage: profileImage || user.photoURL || '',
        user_type: userType,
        email_verified: user.emailVerified,
        created_at: createdAtTimestamp,
        createdAt: createdAtTimestamp,
        auth_provider: 'firebase'
      };

      localStorage.setItem(`dcard_firebase_profile_${user.uid}`, JSON.stringify(profileData));

      return { user, profile: profileData };
    } catch (error) {
      console.error('Firebase SignUp Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Log in user with Email and Password
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profile = this.getStoredProfile(user);
      return { user, profile };
    } catch (error) {
      console.error('Firebase Login Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Sign out active Firebase user
   */
  /**
   * Synchronize Google user data with Firestore collections ("users" and "profiles")
   */
  async syncGoogleUserData(userCredential) {
    if (!userCredential || !userCredential.user) {
      throw new Error('No user credential returned from Google Authentication.');
    }

    const user = userCredential.user;
    const additionalInfo = getAdditionalUserInfo(userCredential);
    const isExplicitNewUser = Boolean(additionalInfo?.isNewUser);

    const userDocRef = doc(db, 'users', user.uid);
    const profileDocRef = doc(db, 'profiles', user.uid);

    let existingUserData = null;
    let existingProfileData = null;

    try {
      const [userSnap, profileSnap] = await Promise.all([
        getDoc(userDocRef),
        getDoc(profileDocRef)
      ]);
      if (userSnap.exists()) existingUserData = userSnap.data();
      if (profileSnap.exists()) existingProfileData = profileSnap.data();
    } catch (e) {
      console.warn('[Firestore Google user check warning]:', e.message);
    }

    const isNewUser = isExplicitNewUser || (!existingUserData && !existingProfileData);
    const createdAtTimestamp = new Date().toISOString();
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const photoURL = user.photoURL || '';

    let profileData = null;

    if (isNewUser) {
      // 1. New Google User: Create records in both 'users' and 'profiles' matching D.CARD schema
      const initialUserData = {
        uid: user.uid,
        name: displayName,
        email: user.email,
        city: '',
        state: '',
        profileImage: photoURL,
        createdAt: createdAtTimestamp
      };

      const initialProfileData = {
        ...initialUserData,
        id: user.uid,
        full_name: displayName,
        phone: '',
        country: 'India',
        user_type: 'Working Professional',
        email_verified: true,
        created_at: createdAtTimestamp,
        auth_provider: 'google'
      };

      try {
        await Promise.all([
          setDoc(userDocRef, initialUserData, { merge: true }),
          setDoc(profileDocRef, initialProfileData, { merge: true })
        ]);
      } catch (err) {
        console.warn('[Firestore Google signup save warning]:', err.message);
      }

      profileData = initialProfileData;
    } else {
      // 2. Existing User: Preserve all custom user info (bookmarks, wishlist, saved cards, city, state, etc.)
      const base = existingProfileData || existingUserData || {};
      profileData = {
        ...base,
        id: user.uid,
        uid: user.uid,
        email: user.email || base.email,
        full_name: base.full_name || base.name || displayName,
        name: base.name || base.full_name || displayName,
        profileImage: base.profileImage || base.avatar_url || photoURL,
        avatar_url: base.avatar_url || base.profileImage || photoURL,
        auth_provider: base.auth_provider || 'google'
      };

      // Safely ensure basic identifiers exist without overwriting existing data
      try {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          ...(base.name ? {} : { name: displayName }),
          ...(base.profileImage ? {} : { profileImage: photoURL })
        }, { merge: true });
      } catch (err) {
        console.warn('[Firestore Google login sync warning]:', err.message);
      }
    }

    // Persist in localStorage for instant retrieval
    try {
      localStorage.setItem(`dcard_firebase_profile_${user.uid}`, JSON.stringify(profileData));
    } catch (e) {
      console.warn('LocalStorage profile save notice:', e);
    }

    return { user, profile: profileData, isNewUser };
  },

  /**
   * Authenticate with Google using Firebase GoogleAuthProvider
   * Prompts user with Google's real account selection screen.
   * Debounces repeated taps to ensure single-tap success and prevent concurrent request conflicts.
   */
  async signInWithGoogle({ useRedirect = false } = {}) {
    // If an authentication request is already executing, return the active promise
    if (activeGoogleSignInPromise) {
      return activeGoogleSignInPromise;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    activeGoogleSignInPromise = (async () => {
      try {
        if (useRedirect) {
          await signInWithRedirect(auth, provider);
          return null;
        }

        try {
          const userCredential = await signInWithPopup(auth, provider);
          return await this.syncGoogleUserData(userCredential);
        } catch (error) {
          console.error('Firebase Google Sign-In Popup Error:', error);
          // If popup was blocked by browser (common on strict mobile settings), attempt redirect fallback
          if (error.code === 'auth/popup-blocked') {
            try {
              await signInWithRedirect(auth, provider);
              return null;
            } catch (redirectError) {
              throw new Error(this.formatErrorMessage(redirectError));
            }
          }
          throw new Error(this.formatErrorMessage(error));
        }
      } finally {
        activeGoogleSignInPromise = null;
      }
    })();

    return activeGoogleSignInPromise;
  },

  /**
   * Handle redirect result after mobile / redirect-based sign-in
   */
  async handleRedirectResult() {
    try {
      const userCredential = await getRedirectResult(auth);
      if (!userCredential || !userCredential.user) {
        return null;
      }
      return await this.syncGoogleUserData(userCredential);
    } catch (error) {
      console.error('Firebase Redirect Auth Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  async logout() {
    try {
      const currentUser = auth.currentUser;
      if (currentUser?.uid) {
        try {
          localStorage.removeItem(`dcard_firebase_profile_${currentUser.uid}`);
        } catch (e) {
          // ignore
        }
      }
      try {
        sessionStorage.removeItem('dcard_auth_redirect');
      } catch (e) {
        // ignore
      }
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Firebase Logout Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Send Password Reset Email
   */
  async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Firebase Forgot Password Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Update password for logged in user
   */
  async updatePassword(newPassword) {
    if (!auth.currentUser) throw new Error('No authenticated user found.');
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      return true;
    } catch (error) {
      console.error('Firebase Password Update Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Update email address for logged in user
   */
  async updateEmail(newEmail) {
    if (!auth.currentUser) throw new Error('No authenticated user found.');
    try {
      await firebaseUpdateEmail(auth.currentUser, newEmail);
      return true;
    } catch (error) {
      console.error('Firebase Email Update Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Get stored profile from localStorage
   */
  getStoredProfile(user) {
    if (!user) return null;
    try {
      const stored = localStorage.getItem(`dcard_firebase_profile_${user.uid}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Profile read error:', e);
    }
    return {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      full_name: user.displayName || user.email?.split('@')[0] || 'User',
      email_verified: user.emailVerified,
      auth_provider: user.providerData?.[0]?.providerId || 'firebase'
    };
  },

  /**
   * Format Firebase error messages to user-friendly text
   */
  formatErrorMessage(error) {
    const code = error.code || '';
    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. You closed the Google sign-in window.';
      case 'auth/cancelled-popup-request':
        return 'Only one sign-in window can be active at a time. Please try again.';
      case 'auth/popup-blocked':
        return 'Google Sign-In popup was blocked by your browser. Please allow popups for this site and try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email address using a different sign-in method. Please sign in with your email and password.';
      case 'auth/operation-not-allowed':
        return 'Google Sign-In is not currently enabled in Firebase Authentication. Please enable Google under Firebase Console > Authentication > Sign-in method.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google Sign-In in Firebase Console.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      default:
        return error.message || 'Authentication error. Please try again.';
    }
  }
};
