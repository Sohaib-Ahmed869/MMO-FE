import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { onboardingAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ClipboardList,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await onboardingAPI.getProgress();
        setProgress(response.progress);
      } catch (err) {
        setError("Failed to load onboarding progress");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "employee") {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getOnboardingStatus = () => {
    if (!progress) return { status: "not_started", percentage: 0 };

    const totalSteps = 13;
    const completedSteps = [
      progress.compliance_statement_completed,
      progress.confidentiality_agreement_completed,
      progress.direct_deposit_completed,
      progress.health_statement_completed,
      progress.hepatitis_b_completed,
      progress.field_practice_completed,
      progress.influenza_declination_completed,
      progress.job_acceptance_completed,
      progress.job_description_completed,
      progress.ppe_acknowledgement_completed,
      progress.policies_procedures_completed,
      progress.handbook_acknowledgment_completed,
      progress.tb_questionnaire_completed,
    ].filter(Boolean).length;

    const percentage = Math.round((completedSteps / totalSteps) * 100);

    let status = "in_progress";
    if (completedSteps === 0) status = "not_started";
    if (completedSteps === totalSteps) status = "completed";

    return { status, percentage, completedSteps, totalSteps };
  };

  const { status, percentage, completedSteps, totalSteps } =
    getOnboardingStatus();

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          text: "Completed",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "in_progress":
        return {
          text: "In Progress",
          bgColor: "bg-primary-100",
          textColor: "text-primary-800",
        };
      default:
        return {
          text: "Not Started",
          bgColor: "bg-secondary-100",
          textColor: "text-secondary-700",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const quickActions = [
    {
      name: "Complete Onboarding",
      description: "Continue your onboarding process",
      href: "/onboarding",
      icon: ClipboardList,
      show: user?.role === "employee" && status !== "completed",
    },
    {
      name: "View Profile",
      description: "Update your personal information",
      href: "/profile",
      icon: User,
      show: true,
    },
    {
      name: "Admin Dashboard",
      description: "Manage users and onboarding",
      href: "/admin",
      icon: BarChart3,
      show: isAdmin || isManager,
    },
    {
      name: "User Management",
      description: "Manage employee accounts",
      href: "/admin/users",
      icon: Users,
      show: isAdmin || isManager,
    },
  ].filter((action) => action.show);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-black rounded-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Welcome back, {user?.full_name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {user?.role === "employee"
                  ? "Track your onboarding progress and complete required forms."
                  : "Manage employee onboarding and system administration."}
              </p>
            </div>

            {user?.employee_id && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/70 text-sm mb-1">Employee ID</p>
                  <p className="text-white font-semibold text-lg">
                    {user.employee_id}
                  </p>
                </div>
                {user?.department && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-1">Department</p>
                    <p className="text-white font-semibold text-lg">
                      {user.department}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Employee Onboarding Progress */}
        {user?.role === "employee" && (
          <div className="bg-white rounded-lg border border-secondary-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  Onboarding Progress
                </h2>
                <p className="text-secondary-600">
                  Complete all required forms to finish onboarding
                </p>
              </div>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
              >
                {statusConfig.text}
              </div>
            </div>

            <div className="space-y-8">
              {/* Progress Visualization */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-700 font-medium">
                    Overall Progress
                  </span>
                  <span className="text-2xl font-bold text-secondary-900">
                    {percentage}%
                  </span>
                </div>
                <div className="relative h-3 bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-700 text-sm font-medium">
                        Completed
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        {completedSteps}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-700 text-sm font-medium">
                        Remaining
                      </p>
                      <p className="text-3xl font-bold text-primary-900">
                        {totalSteps - completedSteps}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-primary-600" />
                  </div>
                </div>

                <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-secondary-600 text-sm font-medium">
                        Total Forms
                      </p>
                      <p className="text-3xl font-bold text-secondary-900">
                        {totalSteps}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-secondary-500" />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {status !== "completed" && (
                <Link
                  to="/onboarding"
                  className="group w-full bg-primary-500 hover:bg-primary-600 text-black font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ClipboardList className="w-5 h-5 mr-3" />
                  Continue Onboarding
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              {status === "completed" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-2 mr-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-green-800 font-semibold text-lg">
                        Congratulations!
                      </h3>
                      <p className="text-green-700">
                        You've completed all onboarding requirements.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-secondary-200 p-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Quick Actions
          </h2>
          <p className="text-secondary-600 mb-8">
            Access frequently used features and tools
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className="group bg-white border border-secondary-200 hover:border-primary-300 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex p-3 rounded-lg bg-primary-500 text-black">
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-secondary-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-700 mb-2 transition-colors">
                    {action.name}
                  </h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {progress?.updated_at && (
          <div className="bg-white rounded-lg border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Recent Activity
            </h2>
            <p className="text-secondary-600 mb-6">
              Your latest progress updates
            </p>

            <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
              <div className="bg-primary-500 rounded-full p-2 flex-shrink-0">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-secondary-900 font-medium mb-1">
                  Onboarding progress updated
                </p>
                <p className="text-secondary-600 text-sm">
                  {new Date(progress.updated_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-full p-2 mr-4">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
