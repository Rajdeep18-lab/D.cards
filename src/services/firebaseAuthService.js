import {
  auth,
  db,
  doc,
  setDoc,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  firebaseUpdateProfile,
  firebaseUpdateEmail,
  firebaseUpdatePassword
} from '../lib/firebase';

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
   * Log in user with Google Auth Popup
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const createdAtTimestamp = new Date().toISOString();

      const userData = {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        city: '',
        state: '',
        profileImage: user.photoURL || '',
        createdAt: createdAtTimestamp
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        await setDoc(doc(db, 'profiles', user.uid), {
          ...userData,
          id: user.uid,
          full_name: user.displayName || 'Google User',
          email_verified: true,
          auth_provider: 'google',
          user_type: 'Working Professional',
          created_at: createdAtTimestamp
        }, { merge: true });
      } catch (err) {
        console.warn('[Firestore users collection Google auth warning]:', err.message);
      }

      // Store/Update profile metadata for Google users
      let profile = this.getStoredProfile(user);
      if (!profile) {
        profile = {
          id: user.uid,
          uid: user.uid,
          email: user.email,
          full_name: user.displayName || 'Google User',
          name: user.displayName || 'Google User',
          avatar_url: user.photoURL || '',
          profileImage: user.photoURL || '',
          email_verified: true,
          auth_provider: 'google',
          user_type: 'Working Professional',
          created_at: createdAtTimestamp,
          createdAt: createdAtTimestamp
        };
        localStorage.setItem(`dcard_firebase_profile_${user.uid}`, JSON.stringify(profile));
      }

      return { user, profile };
    } catch (error) {
      console.error('Firebase Google Auth Error:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  },

  /**
   * Sign out active Firebase user
   */
  async logout() {
    try {
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
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In was cancelled.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      default:
        return error.message || 'Authentication error. Please try again.';
    }
  }
};
