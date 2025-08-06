import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usersAPI, onboardingAPI } from "../../services/api";
import FormDetailsModal from "./FormDetailsModal";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Shield,
  Activity,
  Briefcase,
  Send,
} from "lucide-react";

const EnhancedEmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFormType, setSelectedFormType] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const [employeeResponse, onboardingResponse] = await Promise.all([
        usersAPI.getUserById(id),
        onboardingAPI.getEmployeeOnboardingDetails(id),
      ]);

      setEmployee(employeeResponse.user);
      setOnboardingData(onboardingResponse);
    } catch (error) {
      console.error("Error loading employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewForm = (formKey, formData) => {
    setSelectedForm(formData);
    setSelectedFormType(formKey);
    setShowFormModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            In Progress
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const formTypes = [
    {
      key: "compliance_statements",
      name: "Compliance Statement",
      icon: Shield,
      category: "Compliance",
    },
    {
      key: "confidentiality_agreements",
      name: "Confidentiality Agreement",
      icon: FileText,
      category: "Legal",
    },
    {
      key: "direct_deposit_authorizations",
      name: "Direct Deposit Authorization",
      icon: Briefcase,
      category: "Payroll",
    },
    {
      key: "health_statements",
      name: "Health Statement",
      icon: Activity,
      category: "Medical",
    },
    {
      key: "hepatitis_b_vaccinations",
      name: "Hepatitis B Vaccination",
      icon: Shield,
      category: "Medical",
    },
    {
      key: "field_practice_statements",
      name: "Field Practice Statement",
      icon: Briefcase,
      category: "Training",
    },
    {
      key: "influenza_vaccination_declinations",
      name: "Influenza Vaccination Declination",
      icon: Shield,
      category: "Medical",
    },
    {
      key: "job_acceptance_forms",
      name: "Job Acceptance Form",
      icon: Briefcase,
      category: "HR",
    },
    {
      key: "job_description_acknowledgments",
      name: "Job Description Acknowledgment",
      icon: FileText,
      category: "HR",
    },
    {
      key: "ppe_acknowledgements",
      name: "PPE Acknowledgement",
      icon: Shield,
      category: "Safety",
    },
    {
      key: "policies_procedures_statements",
      name: "Policies & Procedures Statement",
      icon: FileText,
      category: "Compliance",
    },
    {
      key: "employee_handbook_acknowledgments",
      name: "Employee Handbook Acknowledgment",
      icon: FileText,
      category: "HR",
    },
    {
      key: "tb_medical_questionnaires",
      name: "TB Medical Questionnaire",
      icon: Activity,
      category: "Medical",
    },
  ];

  const getFormStatus = (formKey) => {
    if (!onboardingData?.forms) return "not_submitted";
    const forms = onboardingData.forms[formKey];
    return forms && forms.length > 0 ? "submitted" : "not_submitted";
  };

  const getFormData = (formKey) => {
    if (!onboardingData?.forms) return null;
    const forms = onboardingData.forms[formKey];
    return forms && forms.length > 0 ? forms[0] : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupFormsByCategory = () => {
    const categories = {};
    formTypes.forEach((form) => {
      if (!categories[form.category]) {
        categories[form.category] = [];
      }
      categories[form.category].push(form);
    });
    return categories;
  };

  const sendReminder = async () => {
    try {
      // Implement reminder functionality
      console.log("Sending reminder to:", employee.id);
      // You would call an API endpoint here to send reminder
      alert("Reminder sent successfully!");
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Failed to send reminder");
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: User },
    { id: "forms", name: "Onboarding Forms", icon: FileText },
    { id: "activity", name: "Activity Log", icon: Activity },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading employee details...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Employee not found
        </h3>
        <p className="text-gray-600 mb-6">
          The requested employee could not be found.
        </p>
        <Link
          to="/admin/employees"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employees
        </Link>
      </div>
    );
  }

  const completedForms = formTypes.filter(
    (form) => getFormStatus(form.key) === "submitted"
  ).length;
  const progressPercentage = Math.round(
    (completedForms / formTypes.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/employees"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Details
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage employee information
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={sendReminder}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Reminder
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <Link
            to={`/admin/employees/${id}/edit`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Employee
          </Link>
        </div>
      </div>

      {/* Employee Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold text-white">
                  {employee.full_name?.charAt(0) || employee.email?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white truncate">
                {employee.full_name || "No name provided"}
              </h2>
              <p className="text-blue-100 text-lg">
                ID: {employee.employee_id || "Not assigned"}
              </p>
              <div className="flex items-center mt-2 space-x-4">
                {getStatusBadge(employee.onboarding_status)}
                <div className="text-white/90 text-sm">
                  {completedForms}/{formTypes.length} forms completed (
                  {progressPercentage}%)
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-right text-white">
                <p className="text-sm opacity-90">Member since</p>
                <p className="font-medium">{formatDate(employee.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Onboarding Progress
          </h3>
          <span className="text-sm text-gray-500">
            {progressPercentage}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progressPercentage === 100
                ? "bg-green-500"
                : progressPercentage > 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="flex items-center mt-1">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {employee.full_name || "Not provided"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{employee.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {employee.phone || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <div className="flex items-center mt-1">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {employee.department || "Not assigned"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <div className="flex items-center mt-1">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {employee.position || "Not assigned"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {formatDate(employee.start_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Active</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {employee.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(employee.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "forms" && (
        <div className="space-y-6">
          {Object.entries(groupFormsByCategory()).map(([category, forms]) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                {category} Forms
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {forms.map((form) => {
                  const Icon = form.icon;
                  const status = getFormStatus(form.key);
                  const formData = getFormData(form.key);

                  return (
                    <div
                      key={form.key}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              status === "submitted"
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                status === "submitted"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">
                              {form.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {status === "submitted"
                                ? "Form submitted"
                                : "Not submitted"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {status === "submitted" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {status === "submitted" && formData && (
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Submitted:</span>
                              <span className="text-gray-900">
                                {formatDate(formData.created_at)}
                              </span>
                            </div>
                            {formData.electronic_signature && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Signed by:
                                </span>
                                <span className="text-gray-900 truncate ml-2">
                                  {formData.electronic_signature}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-gray-600">Actions:</span>
                              <button
                                className="flex items-center text-blue-600 hover:text-blue-700 text-xs font-medium"
                                onClick={() =>
                                  handleViewForm(form.key, formData)
                                }
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {status === "not_submitted" && (
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <div className="text-center">
                            <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">
                              Awaiting submission
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Activity Log
          </h3>
          <div className="space-y-4">
            {/* Mock activity data - in real app, this would come from database */}
            {[
              {
                id: 1,
                action: "Employee account created",
                timestamp: employee.created_at,
                type: "account",
              },
              ...(onboardingData?.forms
                ? Object.entries(onboardingData.forms)
                    .filter(([key, forms]) => forms && forms.length > 0)
                    .map(([key, forms], index) => ({
                      id: index + 2,
                      action: `Submitted ${
                        formTypes.find((f) => f.key === key)?.name || key
                      }`,
                      timestamp: forms[0].created_at,
                      type: "form_submission",
                    }))
                : []),
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "account"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "account" ? (
                        <User
                          className={`w-4 h-4 ${
                            activity.type === "account"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Form Details Modal */}
      <FormDetailsModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        formData={selectedForm}
        formType={selectedFormType}
      />
    </div>
  );
};

export default EnhancedEmployeeDetail;
