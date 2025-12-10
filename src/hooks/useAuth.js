/**
 * Custom hook for Firebase authentication
 * Supports both Anonymous and Google Sign-in
 */

import { useState, useEffect } from 'react';
import { 
  signInAnonymously, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithCustomToken,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication
    const initAuth = async () => {
      try {
        // Support for custom token authentication (for embedded apps)
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        }
        // If no user is signed in, will be handled by the UI
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    };

    initAuth();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  };

  // Sign in anonymously
  const signInAnonymous = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  return { 
    user, 
    isLoading, 
    signInWithGoogle, 
    signInAnonymous,
    signOut,
    isAnonymous: user?.isAnonymous || false
  };
};
