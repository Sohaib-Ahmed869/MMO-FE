// AdminRoutes.jsx - Complete routing structure for admin section
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import EmployeesList from "../admin/EmployeeList";
import EmployeeDetail from "../admin/EmployeeDetails";
import OnboardingOverview from "../admin/OnboardingOverview";

// Protected route wrapper for admin pages
const AdminProtectedRoute = ({ children }) => {
  const { user, isAdmin, isManager } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && !isManager) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin Dashboard */}
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* Employee Management */}
      <Route
        path="/employees"
        element={
          <AdminProtectedRoute>
            <EmployeesList />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/employees/:id"
        element={
          <AdminProtectedRoute>
            <EmployeeDetail />
          </AdminProtectedRoute>
        }
      />

      {/* Onboarding Management */}
      <Route
        path="/onboarding"
        element={
          <AdminProtectedRoute>
            <OnboardingOverview />
          </AdminProtectedRoute>
        }
      />

      {/* Catch all - redirect to admin dashboard */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
