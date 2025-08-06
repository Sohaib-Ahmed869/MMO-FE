import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/placeholders";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import { Profile } from "./pages/placeholders";

// Onboarding pages
import OnboardingDashboard from "./pages/onboarding/OnboardingDashboard";
import ComplianceStatement from "./pages/onboarding/ComplianceStatement";
import {
  ConfidentialityAgreement,
  DirectDepositForm,
  HealthStatement,
  HepatitisB,
  FieldPractice,
  InfluenzaDeclination,
  JobAcceptance,
  JobDescription,
  PPEAcknowledgement,
  PoliciesProcedures,
  HandbookAcknowledgment,
  TBQuestionnaire,
} from "./pages/placeholders";

// Admin pages
import {
  AdminDashboard,
  UserManagement,
  OnboardingManagement,
} from "./pages/placeholders";
import AdminRoutes from "./pages/auth/AdminRoutes";
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      {/* Main dashboard */}
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />

                      {/* Onboarding routes */}
                      <Route
                        path="/onboarding"
                        element={<OnboardingDashboard />}
                      />
                      <Route
                        path="/onboarding/compliance-statement"
                        element={<ComplianceStatement />}
                      />
                      <Route
                        path="/onboarding/confidentiality-agreement"
                        element={<ConfidentialityAgreement />}
                      />
                      <Route
                        path="/onboarding/direct-deposit"
                        element={<DirectDepositForm />}
                      />
                      <Route
                        path="/onboarding/health-statement"
                        element={<HealthStatement />}
                      />
                      <Route
                        path="/onboarding/hepatitis-b"
                        element={<HepatitisB />}
                      />
                      <Route
                        path="/onboarding/field-practice"
                        element={<FieldPractice />}
                      />
                      <Route
                        path="/onboarding/influenza-declination"
                        element={<InfluenzaDeclination />}
                      />
                      <Route
                        path="/onboarding/job-acceptance"
                        element={<JobAcceptance />}
                      />
                      <Route
                        path="/onboarding/job-description"
                        element={<JobDescription />}
                      />
                      <Route
                        path="/onboarding/ppe-acknowledgement"
                        element={<PPEAcknowledgement />}
                      />
                      <Route
                        path="/onboarding/policies-procedures"
                        element={<PoliciesProcedures />}
                      />
                      <Route
                        path="/onboarding/handbook-acknowledgment"
                        element={<HandbookAcknowledgment />}
                      />
                      <Route
                        path="/onboarding/tb-questionnaire"
                        element={<TBQuestionnaire />}
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/admin/*" element={<AdminRoutes />} />

          
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
