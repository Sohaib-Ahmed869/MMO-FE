import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, usersAPI } from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        if (storedUser && token) {
          // Verify token is still valid by fetching user profile
          const profileData = await usersAPI.getProfile();
          setUser(profileData.user);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid stored data
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signupEmployee = async (userData) => {
    try {
      const response = await authAPI.signupEmployee(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signupAdmin = async (userData) => {
    try {
      const response = await authAPI.signupAdmin(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const resetPassword = async (email) => {
    try {
      const response = await authAPI.resetPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signupEmployee,
    signupAdmin,
    updateUser,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isManager: user?.role === "manager",
    isEmployee: user?.role === "employee",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
