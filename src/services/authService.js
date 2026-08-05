import { firebaseAuthService } from './firebaseAuthService';
import { db, collection, query, where, getDocs } from '../lib/firebase';

export const authService = {
  /**
   * Registers a new user with extended metadata using Firebase Auth & Firestore
   */
  async signUp({ email, password, fullName, phone, country = 'India', state, city, userType = 'Working Professional' }) {
    if (phone) {
      const exists = await this.checkPhoneExists(phone);
      if (exists) {
        throw new Error('This phone number is already registered with another D.Card account.');
      }
    }
    return await firebaseAuthService.signUp({ email, password, fullName, phone, country, state, city, userType });
  },

  /**
   * Checks if a phone number already exists in Firestore profiles collection
   */
  async checkPhoneExists(phone) {
    if (!phone) return false;
    const cleanPhone = phone.trim();
    try {
      const q = query(collection(db, 'profiles'), where('phone', '==', cleanPhone));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (err) {
      console.warn('Firestore phone check notice:', err.message);
      return false;
    }
  },

  /**
   * Logs in a user using email and password
   */
  async login(email, password) {
    return await firebaseAuthService.login(email, password);
  },

  /**
   * Logs in with Google Sign-In
   */
  async loginWithGoogle() {
    return await firebaseAuthService.loginWithGoogle();
  },

  /**
   * Terminates active user session
   */
  async logout() {
    return await firebaseAuthService.logout();
  },

  /**
   * Requests a password recovery email link
   */
  async forgotPassword(email) {
    return await firebaseAuthService.forgotPassword(email);
  },

  /**
   * Updates user password
   */
  async updatePassword(newPassword) {
    return await firebaseAuthService.updatePassword(newPassword);
  },

  /**
   * Updates account email address
   */
  async updateEmail(newEmail) {
    return await firebaseAuthService.updateEmail(newEmail);
  }
};
