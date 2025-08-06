import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Book } from "lucide-react";
import FormBase from "../../../components/FormBase";

// Policies & Procedures Statement Form
const policiesSchema = Joi.object({
  employee_name: Joi.string()
    .required()
    .messages({ "string.empty": "Employee name is required" }),
  employee_id: Joi.string()
    .required()
    .messages({ "string.empty": "Employee ID is required" }),
  policies_read: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm reading company policies" }),
  procedures_understood: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm understanding procedures" }),
  compliance_agreed: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must agree to comply with policies" }),
  electronic_signature: Joi.string()
    .required()
    .messages({ "string.empty": "Electronic signature is required" }),
  signature_date: Joi.date()
    .required()
    .messages({ "date.base": "Signature date is required" }),
});

const PoliciesFormComponent = ({
  onSubmit,
  onSaveDraft,
  isSubmitting,
  isSaving,
}) => {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(policiesSchema),
    defaultValues: {
      employee_name: user?.full_name || "",
      employee_id: user?.employee_id || "",
      signature_date: new Date().toISOString().split("T")[0],
    },
  });

  const handleFormSubmit = async (data, isDraft = false) => {
    setError("");
    try {
      await onSubmit(data, isDraft);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to submit form. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => handleFormSubmit(data, false))}
      className="space-y-8"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Book className="w-5 h-5 mr-2 text-primary-600" />
          Employee Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Employee Name *</label>
            <input
              {...register("employee_name")}
              type="text"
              className={`form-input ${
                errors.employee_name ? "border-red-300" : ""
              }`}
              placeholder="Enter your full name"
            />
            {errors.employee_name && (
              <p className="form-error">{errors.employee_name.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Employee ID *</label>
            <input
              {...register("employee_id")}
              type="text"
              className={`form-input ${
                errors.employee_id ? "border-red-300" : ""
              }`}
              placeholder="Enter your employee ID"
            />
            {errors.employee_id && (
              <p className="form-error">{errors.employee_id.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Policies & Procedures Acknowledgment
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-blue-800 mb-3">
            Company Policies and Procedures
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            As an employee, you are expected to be familiar with and comply with
            all company policies and procedures, including but not limited to:
          </p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Code of conduct and professional behavior standards</li>
            <li>Safety and security procedures</li>
            <li>Quality assurance and compliance requirements</li>
            <li>Communication and reporting protocols</li>
            <li>Privacy and confidentiality policies</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("policies_read")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Policies Read *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I have read and reviewed all relevant company policies and
                procedures.
              </p>
            </div>
          </div>
          {errors.policies_read && (
            <p className="form-error ml-7">{errors.policies_read.message}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("procedures_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Procedures Understood *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I understand the procedures and my responsibilities under
                company policies.
              </p>
            </div>
          </div>
          {errors.procedures_understood && (
            <p className="form-error ml-7">
              {errors.procedures_understood.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("compliance_agreed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Compliance Agreement *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I agree to comply with all company policies and procedures
                during my employment.
              </p>
            </div>
          </div>
          {errors.compliance_agreed && (
            <p className="form-error ml-7">
              {errors.compliance_agreed.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Electronic Signature
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Electronic Signature *</label>
            <input
              {...register("electronic_signature")}
              type="text"
              className={`form-input ${
                errors.electronic_signature ? "border-red-300" : ""
              }`}
              placeholder="Type your full name"
            />
            {errors.electronic_signature && (
              <p className="form-error">
                {errors.electronic_signature.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Signature Date *</label>
            <input
              {...register("signature_date")}
              type="date"
              className={`form-input ${
                errors.signature_date ? "border-red-300" : ""
              }`}
            />
            {errors.signature_date && (
              <p className="form-error">{errors.signature_date.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {onSaveDraft && (
          <button
            type="button"
            onClick={handleSubmit((data) => handleFormSubmit(data, true))}
            disabled={isSaving}
            className="btn-secondary flex items-center px-6 py-3"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              "Save Draft"
            )}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center px-6 py-3 ml-auto"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            "Submit Policies Statement"
          )}
        </button>
      </div>
    </form>
  );
};

export const PoliciesProcedures = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitPoliciesProcedures(data);
  };

  return (
    <FormBase
      title="Policies & Procedures Statement"
      description="Acknowledge that you have read and understand company policies and procedures."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <PoliciesFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};
