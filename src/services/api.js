import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Employee signup
  signupEmployee: async (userData) => {
    const response = await api.post("/auth/signup/employee", userData);
    return response.data;
  },

  // Admin signup
  signupAdmin: async (userData) => {
    const response = await api.post("/auth/signup/admin", userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.session) {
      localStorage.setItem("access_token", response.data.session.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },

  // Reset password
  resetPassword: async (email) => {
    const response = await api.post("/auth/reset-password", { email });
    return response.data;
  },
};

// Users API calls
export const usersAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  // Get all users (admin/manager only)
  getAllUsers: async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  // Get user by ID (admin/manager only)
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deactivate user (admin only)
  deactivateUser: async (id) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },
};

// Onboarding API calls
export const onboardingAPI = {
  // Get onboarding progress
  getProgress: async () => {
    const response = await api.get("/onboarding/progress");
    return response.data;
  },

  // Update progress after form submission
  updateProgress: async () => {
    const response = await api.get("/onboarding/progress");
    return response.data;
  },

  // Submit compliance statement
  submitComplianceStatement: async (data) => {
    console.log("Submitting compliance statement:", data);
    const response = await api.post("/onboarding/compliance-statement", data);
    return response.data;
  },

  // Submit confidentiality agreement
  submitConfidentialityAgreement: async (data) => {
    const response = await api.post(
      "/onboarding/confidentiality-agreement",
      data
    );
    return response.data;
  },

  // Submit direct deposit authorization
  submitDirectDeposit: async (data) => {
    const response = await api.post("/onboarding/direct-deposit", data);
    return response.data;
  },

  // Submit health statement
  submitHealthStatement: async (data) => {
    const response = await api.post("/onboarding/health-statement", data);
    return response.data;
  },

  // Submit hepatitis B form
  submitHepatitisB: async (data) => {
    const response = await api.post("/onboarding/hepatitis-b", data);
    return response.data;
  },

  // Submit field practice statement
  submitFieldPractice: async (data) => {
    const response = await api.post("/onboarding/field-practice", data);
    return response.data;
  },

  // Submit influenza vaccination declination
  submitInfluenzaDeclination: async (data) => {
    const response = await api.post("/onboarding/influenza-declination", data);
    return response.data;
  },

  // Submit job acceptance form
  submitJobAcceptance: async (data) => {
    const response = await api.post("/onboarding/job-acceptance", data);
    return response.data;
  },

  // Submit job description acknowledgment
  submitJobDescription: async (data) => {
    const response = await api.post("/onboarding/job-description", data);
    return response.data;
  },

  // Submit PPE acknowledgement
  submitPPEAcknowledgement: async (data) => {
    const response = await api.post("/onboarding/ppe-acknowledgement", data);
    return response.data;
  },

  // Submit policies & procedures statement
  submitPoliciesProcedures: async (data) => {
    const response = await api.post("/onboarding/policies-procedures", data);
    return response.data;
  },

  // Submit employee handbook acknowledgment
  submitHandbookAcknowledgment: async (data) => {
    const response = await api.post(
      "/onboarding/handbook-acknowledgment",
      data
    );
    return response.data;
  },

  // Submit TB medical questionnaire
  submitTBQuestionnaire: async (data) => {
    const response = await api.post("/onboarding/tb-questionnaire", data);
    return response.data;
  },

  // Get all submitted forms
  getForms: async () => {
    const response = await api.get("/onboarding/forms");
    return response.data;
  },

  // Admin: Get all onboarding data
  getAllOnboardingData: async (params = {}) => {
    const response = await api.get("/onboarding/admin/all", { params });
    return response.data;
  },

  // Admin: Get specific employee's onboarding details
  getEmployeeOnboardingDetails: async (id) => {
    const response = await api.get(`/onboarding/admin/employee/${id}`);
    return response.data;
  },
};

export default api;
