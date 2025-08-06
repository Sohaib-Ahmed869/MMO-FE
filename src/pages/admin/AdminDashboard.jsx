import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usersAPI, onboardingAPI } from '../../services/api'; // Adjust the import path as necessary
import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Calendar,
  Activity,
  BarChart3,
  ArrowRight,
  UserPlus,
  Filter,
  Download,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingOnboarding: 0,
    completedOnboarding: 0,
    inProgress: 0,
    recentSignups: 0,
    completionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load users and onboarding data
      const [usersResponse, onboardingResponse] = await Promise.all([
        usersAPI.getAllUsers({ limit: 100 }),
        onboardingAPI.getAllOnboardingData({ limit: 50 }),
      ]);

      const users = usersResponse.users || [];
      const employees = users.filter((user) => user.role === "employee");

      // Calculate statistics
      const pending = employees.filter(
        (emp) => emp.onboarding_status === "pending"
      ).length;
      const completed = employees.filter(
        (emp) => emp.onboarding_status === "completed"
      ).length;
      const inProgress = employees.filter(
        (emp) => emp.onboarding_status === "in_progress"
      ).length;

      // Recent signups (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recent = employees.filter(
        (emp) => new Date(emp.created_at) > weekAgo
      ).length;

      const completionRate =
        employees.length > 0
          ? Math.round((completed / employees.length) * 100)
          : 0;

      setStats({
        totalEmployees: employees.length,
        pendingOnboarding: pending,
        completedOnboarding: completed,
        inProgress: inProgress,
        recentSignups: recent,
        completionRate: completionRate,
      });

      // Set pending employees for quick review
      setPendingEmployees(
        employees
          .filter((emp) => emp.onboarding_status === "pending")
          .slice(0, 5)
      );

      // Mock recent activity - in real app, this would come from an activity log
      setRecentActivity([
        {
          id: 1,
          type: "form_submission",
          employee: "John Smith",
          action: "Submitted TB Questionnaire",
          time: "2 hours ago",
          status: "success",
        },
        {
          id: 2,
          type: "signup",
          employee: "Sarah Johnson",
          action: "Created employee account",
          time: "4 hours ago",
          status: "info",
        },
        {
          id: 3,
          type: "completion",
          employee: "Mike Davis",
          action: "Completed onboarding process",
          time: "6 hours ago",
          status: "success",
        },
        {
          id: 4,
          type: "form_submission",
          employee: "Emily Wilson",
          action: "Submitted Health Statement",
          time: "1 day ago",
          status: "success",
        },
        {
          id: 5,
          type: "reminder",
          employee: "System",
          action: "Sent onboarding reminders to 5 employees",
          time: "1 day ago",
          status: "warning",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: `+${stats.recentSignups}`,
      changeText: "new this week",
    },
    {
      title: "Pending Onboarding",
      value: stats.pendingOnboarding,
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      urgent: stats.pendingOnboarding > 5,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Activity,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Completed",
      value: stats.completedOnboarding,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      change: `${stats.completionRate}%`,
      changeText: "completion rate",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "form_submission":
        return FileText;
      case "signup":
        return UserPlus;
      case "completion":
        return CheckCircle;
      case "reminder":
        return Clock;
      default:
        return Activity;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
    

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.urgent && (
                      <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
                    )}
                  </div>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {stat.changeText}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <Link
                  to="/admin/activity"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4"
                    >
                      <div
                        className={`p-2 rounded-lg ${getActivityColor(
                          activity.status
                        )}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.employee}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="space-y-6">
       

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/admin/employees"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <Users className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  Manage Employees
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
              </Link>

              <Link
                to="/admin/onboarding"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <ClipboardCheck className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  Review Forms
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
              </Link>

             
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default AdminDashboard;
