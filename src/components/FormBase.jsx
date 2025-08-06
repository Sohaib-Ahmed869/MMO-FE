import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import {
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const FormBase = ({
  title,
  description,
  children,
  onSubmit,
  isSubmitting = false,
  submitText = "Submit Form",
  showBackButton = true,
  backUrl = "/onboarding",
  allowSaveDraft = false,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data, isDraft = false) => {
    try {
      await onSubmit(data, isDraft);

      if (!isDraft) {
        setShowSuccess(true);

        // Auto redirect after success
        setTimeout(() => {
          navigate(backUrl);
        }, 2500);
      }
    } catch (error) {
      // Error handling is done in the parent component
      throw error;
    }
  };

  const handleSaveDraft = async (data) => {
    setSaving(true);
    try {
      await handleSubmit(data, true);
      // Show temporary success message for draft save
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      toast.textContent = "Draft saved successfully!";
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setSaving(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Form Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your {title.toLowerCase()} has been received and processed. You'll
              be redirected to the onboarding dashboard shortly.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <LoadingSpinner size="small" />
              <span>Redirecting in a moment...</span>
            </div>
            <div className="mt-4">
              <Link
                to={backUrl}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Return to dashboard now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {showBackButton && (
          <Link
            to={backUrl}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Onboarding
          </Link>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}

          {/* Progress indicator */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Estimated completion time: 5-10 minutes</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Form Details</h2>
          <p className="text-sm text-gray-600 mt-1">
            Please fill out all required fields marked with an asterisk (*)
          </p>
        </div>

        <div className="p-6">
          {React.cloneElement(children, {
            onSubmit: handleSubmit,
            onSaveDraft: allowSaveDraft ? handleSaveDraft : null,
            isSubmitting,
            isSaving: saving,
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Important Information
            </h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>
                • All information provided will be kept confidential and secure.
              </p>
              <p>
                • Electronic signatures are legally binding and equivalent to
                handwritten signatures.
              </p>
              <p>
                • You can save your progress and return to complete the form
                later if needed.
              </p>
              <p>
                • Contact HR if you have questions or need assistance completing
                this form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBase;
