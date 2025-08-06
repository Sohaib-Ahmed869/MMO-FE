import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  AlertCircle,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";

const jobAcceptanceSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  position_accepted: Joi.string().required().messages({
    "string.empty": "Position title is required",
  }),
  department: Joi.string().required().messages({
    "string.empty": "Department is required",
  }),
  start_date: Joi.date().required().messages({
    "date.base": "Start date is required",
  }),
  salary_amount: Joi.number().positive().required().messages({
    "number.positive": "Salary amount must be positive",
    "any.required": "Salary amount is required",
  }),
  salary_frequency: Joi.string()
    .valid("hourly", "weekly", "biweekly", "monthly", "annually")
    .required()
    .messages({
      "string.empty": "Salary frequency is required",
      "any.only": "Please select a valid salary frequency",
    }),
  employment_type: Joi.string()
    .valid("full-time", "part-time", "contract", "temporary")
    .required()
    .messages({
      "string.empty": "Employment type is required",
      "any.only": "Please select a valid employment type",
    }),
  reporting_manager: Joi.string().required().messages({
    "string.empty": "Reporting manager is required",
  }),
  work_location: Joi.string().required().messages({
    "string.empty": "Work location is required",
  }),
  salary_acknowledged: Joi.boolean().valid(true).required().messages({
    "any.only": "You must acknowledge the salary and compensation terms",
  }),
  benefits_understood: Joi.boolean().valid(true).required().messages({
    "any.only": "You must acknowledge understanding of benefits",
  }),
  terms_conditions_accepted: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the terms and conditions of employment",
  }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const JobAcceptanceFormComponent = ({
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
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(jobAcceptanceSchema),
    defaultValues: {
      employee_name: user?.full_name || "",
      employee_id: user?.employee_id || "",
      department: user?.department || "",
      signature_date: new Date().toISOString().split("T")[0],
    },
  });

  const salaryFrequency = watch("salary_frequency");

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

  const getSalaryLabel = () => {
    switch (salaryFrequency) {
      case "hourly":
        return "Hourly Rate";
      case "weekly":
        return "Weekly Salary";
      case "biweekly":
        return "Biweekly Salary";
      case "monthly":
        return "Monthly Salary";
      case "annually":
        return "Annual Salary";
      default:
        return "Salary Amount";
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

      {/* Employee Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
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

      {/* Position Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
          Position Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Position Accepted *</label>
            <input
              {...register("position_accepted")}
              type="text"
              className={`form-input ${
                errors.position_accepted ? "border-red-300" : ""
              }`}
              placeholder="Enter position title"
            />
            {errors.position_accepted && (
              <p className="form-error">{errors.position_accepted.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Department *</label>
            <input
              {...register("department")}
              type="text"
              className={`form-input ${
                errors.department ? "border-red-300" : ""
              }`}
              placeholder="Enter department"
            />
            {errors.department && (
              <p className="form-error">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Employment Type *</label>
            <select
              {...register("employment_type")}
              className={`form-input ${
                errors.employment_type ? "border-red-300" : ""
              }`}
            >
              <option value="">Select employment type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </select>
            {errors.employment_type && (
              <p className="form-error">{errors.employment_type.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Start Date *</label>
            <input
              {...register("start_date")}
              type="date"
              className={`form-input ${
                errors.start_date ? "border-red-300" : ""
              }`}
            />
            {errors.start_date && (
              <p className="form-error">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Reporting Manager *</label>
            <input
              {...register("reporting_manager")}
              type="text"
              className={`form-input ${
                errors.reporting_manager ? "border-red-300" : ""
              }`}
              placeholder="Enter manager's name"
            />
            {errors.reporting_manager && (
              <p className="form-error">{errors.reporting_manager.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Work Location *</label>
            <input
              {...register("work_location")}
              type="text"
              className={`form-input ${
                errors.work_location ? "border-red-300" : ""
              }`}
              placeholder="e.g., Main Office, Remote, Field"
            />
            {errors.work_location && (
              <p className="form-error">{errors.work_location.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Compensation Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
          Compensation Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Salary Frequency *</label>
            <select
              {...register("salary_frequency")}
              className={`form-input ${
                errors.salary_frequency ? "border-red-300" : ""
              }`}
            >
              <option value="">Select frequency</option>
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
            {errors.salary_frequency && (
              <p className="form-error">{errors.salary_frequency.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">{getSalaryLabel()} *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                {...register("salary_amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className={`form-input pl-8 ${
                  errors.salary_amount ? "border-red-300" : ""
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.salary_amount && (
              <p className="form-error">{errors.salary_amount.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Acknowledgments */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Terms and Acknowledgments
        </h3>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Job Acceptance:</strong> By accepting this position, I
              agree to:
            </p>

            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>
                Perform the duties and responsibilities outlined in the job
                description
              </li>
              <li>
                Comply with all company policies, procedures, and regulations
              </li>
              <li>
                Maintain professional conduct and confidentiality standards
              </li>
              <li>Complete all required training and onboarding activities</li>
              <li>Provide required documentation for employment eligibility</li>
            </ul>

            <p>
              <strong>Employment Terms:</strong> I understand that this is an
              at-will employment relationship and that either party may
              terminate the employment at any time with or without cause or
              notice.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("salary_acknowledged")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Salary and Compensation Acknowledgment *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I acknowledge and accept the salary amount and frequency as
                stated above, and understand the compensation structure for this
                position.
              </p>
            </div>
          </div>
          {errors.salary_acknowledged && (
            <p className="form-error ml-7">
              {errors.salary_acknowledged.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("benefits_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Benefits Understanding *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I understand the benefits package associated with this position
                and acknowledge receipt of benefits information.
              </p>
            </div>
          </div>
          {errors.benefits_understood && (
            <p className="form-error ml-7">
              {errors.benefits_understood.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("terms_conditions_accepted")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Terms and Conditions Acceptance *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I accept all terms and conditions of employment as outlined in
                the offer letter and company policies.
              </p>
            </div>
          </div>
          {errors.terms_conditions_accepted && (
            <p className="form-error ml-7">
              {errors.terms_conditions_accepted.message}
            </p>
          )}
        </div>
      </div>

      {/* Electronic Signature */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Electronic Signature
        </h3>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                Job Acceptance Confirmation
              </h4>
              <p className="text-sm text-green-700 mt-1">
                By providing your electronic signature below, you are formally
                accepting this job offer and agreeing to all terms and
                conditions stated above.
              </p>
            </div>
          </div>
        </div>

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
            <p className="text-xs text-gray-500 mt-1">
              Type your full legal name to accept this job offer
            </p>
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

      {/* Submit Buttons */}
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
            "Accept Job Offer"
          )}
        </button>
      </div>
    </form>
  );
};

const JobAcceptance = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitJobAcceptance(data);
  };

  return (
    <FormBase
      title="Job Acceptance Form"
      description="Please review and formally accept your job offer by completing this form. Ensure all details are correct before submitting."
      allowSaveDraft={true}
      onSubmit={handleSubmit}
    >
      <JobAcceptanceFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default JobAcceptance;
