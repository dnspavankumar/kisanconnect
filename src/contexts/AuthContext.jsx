import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getUserProfile, updateUserProfile, signOutUser } from '@/services/authService';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(firebaseUser);
        setUserProfile(profile);
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    if (user) {
      const result = await updateUserProfile(user.uid, updates);
      if (result.success) {
        // Refresh profile
        const updatedProfile = await getUserProfile(user.uid);
        setUserProfile(updatedProfile);
      }
      return result;
    }
    return { success: false, message: 'No user logged in' };
  };

  const value = {
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
