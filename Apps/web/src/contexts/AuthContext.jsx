import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return { requiresMfa: false, user: authData.record };
  };

  const signup = async (email, password, passwordConfirm, name) => {
    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      name,
    }, { $autoCancel: false });
    
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      return authData.record;
    } catch (error) {
      console.error('Auto-login after signup failed:', error);
      return record;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const isAuthenticated = Boolean(currentUser);

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    signup,
    initialLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}