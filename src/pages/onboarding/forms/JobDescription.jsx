// Job Description Acknowledgment Form
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
  FileText,
  CheckCircle,
  Shield,
  Book,
  Activity,
} from "lucide-react";

// Job Description Acknowledgment
const jobDescriptionSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  job_duties_understood: Joi.boolean().valid(true).required().messages({
    "any.only": "You must acknowledge understanding of job duties",
  }),
  responsibilities_acknowledged: Joi.boolean().valid(true).required().messages({
    "any.only": "You must acknowledge your responsibilities",
  }),
  requirements_met: Joi.boolean().valid(true).required().messages({
    "any.only": "You must confirm you meet the requirements",
  }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const JobDescriptionFormComponent = ({
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
    resolver: joiResolver(jobDescriptionSchema),
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
          <FileText className="w-5 h-5 mr-2 text-primary-600" />
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
          Job Description Acknowledgment
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-800">
            Please confirm that you have reviewed your job description and
            understand the duties, responsibilities, and requirements of your
            position.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("job_duties_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Job Duties Understanding *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I have reviewed and understand all job duties and tasks outlined
                in my job description.
              </p>
            </div>
          </div>
          {errors.job_duties_understood && (
            <p className="form-error ml-7">
              {errors.job_duties_understood.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("responsibilities_acknowledged")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Responsibilities Acknowledgment *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I acknowledge my responsibilities and commit to performing them
                to the best of my ability.
              </p>
            </div>
          </div>
          {errors.responsibilities_acknowledged && (
            <p className="form-error ml-7">
              {errors.responsibilities_acknowledged.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("requirements_met")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Requirements Confirmation *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that I meet all the qualifications and requirements
                for this position.
              </p>
            </div>
          </div>
          {errors.requirements_met && (
            <p className="form-error ml-7">{errors.requirements_met.message}</p>
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
            "Submit Job Description Acknowledgment"
          )}
        </button>
      </div>
    </form>
  );
};

export const JobDescription = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitJobDescription(data);
  };

  return (
    <FormBase
      title="Job Description Acknowledgment"
      description="Please review and acknowledge your job description, duties, and responsibilities."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <JobDescriptionFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};
