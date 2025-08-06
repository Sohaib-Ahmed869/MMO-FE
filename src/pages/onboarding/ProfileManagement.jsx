import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usersAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Edit3,
  Shield,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProfileManagement = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    position: "",
    phone: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await usersAPI.getProfile();
        const userData = response.user;

        const profileData = {
          full_name: userData.full_name || "",
          department: userData.department || "",
          position: userData.position || "",
          phone: userData.phone || "",
        };

        setFormData(profileData);
        setOriginalData(profileData);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await usersAPI.updateProfile(formData);

      // Update the auth context with new user data
      updateUser(response.user);

      setOriginalData(formData);
      setEditing(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditing(false);
    setMessage({ type: "", text: "" });
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-secondary-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-secondary-200 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Profile Management
              </h1>
              <p className="text-secondary-600">
                Manage your personal information and account settings
              </p>
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black font-medium rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-secondary-200 p-8 sticky top-8">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-black text-2xl font-bold">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mt-4">
                  {user?.full_name || "User Name"}
                </h3>
                <p className="text-secondary-600">
                  {user?.position || "Position"}
                </p>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                  <Shield className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-500">Role</p>
                    <p className="font-medium text-secondary-900 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                  <Mail className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-500">Email</p>
                    <p className="font-medium text-secondary-900">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                  <Calendar className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-500">Employee ID</p>
                    <p className="font-medium text-secondary-900">
                      {user?.employee_id || "N/A"}
                    </p>
                  </div>
                </div>

                {user?.start_date && (
                  <div className="flex items-center p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                    <Clock className="w-5 h-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-sm text-secondary-500">Start Date</p>
                      <p className="font-medium text-secondary-900">
                        {new Date(user.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-secondary-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Personal Information
                  </h2>
                  <p className="text-secondary-600">
                    Update your personal details and contact information
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-colors ${
                        editing
                          ? "border-secondary-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          : "border-secondary-200 bg-secondary-50 text-secondary-600"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-colors ${
                        editing
                          ? "border-secondary-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          : "border-secondary-200 bg-secondary-50 text-secondary-600"
                      }`}
                      placeholder="Enter your department"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Position
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-colors ${
                        editing
                          ? "border-secondary-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          : "border-secondary-200 bg-secondary-50 text-secondary-600"
                      }`}
                      placeholder="Enter your position"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-colors ${
                        editing
                          ? "border-secondary-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          : "border-secondary-200 bg-secondary-50 text-secondary-600"
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {editing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={saving || !hasChanges}
                      className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        saving || !hasChanges
                          ? "bg-secondary-300 text-secondary-500 cursor-not-allowed"
                          : "bg-primary-500 hover:bg-primary-600 text-black"
                      }`}
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
