import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "../services/authService";
import API_BASE_URL from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, query backend for current user via cookie (if any)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        // not logged in
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Sign in: call login endpoint then refresh current user
  const signIn = async (email, password) => {
    try {
      const loginResult = await loginUser({ email, password });
      console.log('Login result:', loginResult);
    } catch (loginError) {
      console.error('Login failed:', loginError);
      // If login itself fails (network or credential error), propagate that
      if (loginError.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 8080.');
      }
      throw loginError;
    }

    // If login succeeded, fetch current user via cookie
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      } else {
        // Try to extract error details from response
        let errorMsg = `Server returned ${res.status}`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errData.error || errorMsg;
        } catch (e) {
          // couldn't parse error body
        }
        throw new Error(`Authentication failed: ${errorMsg}`);
      }
    } catch (e) {
      console.error('Auth verification error:', e);
      if (e.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Ensure backend is running on port 8080.');
      }
      throw e;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
