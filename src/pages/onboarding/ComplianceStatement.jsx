import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../contexts/AuthContext";
import { onboardingAPI } from "../../services/api";
import FormBase from "../../components/FormBase";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AlertCircle } from "lucide-react";

const complianceSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  position: Joi.string().required().messages({
    "string.empty": "Position is required",
  }),
  start_date: Joi.date().required().messages({
    "date.base": "Start date is required",
  }),
  background_check_completed: Joi.boolean().valid(true).required().messages({
    "any.only": "Background check completion must be confirmed",
  }),
  drug_screening_completed: Joi.boolean().valid(true).required().messages({
    "any.only": "Drug screening completion must be confirmed",
  }),
  licensure_verification: Joi.boolean().valid(true).required().messages({
    "any.only": "Licensure verification must be confirmed",
  }),
  tb_testing_completed: Joi.boolean().valid(true).required().messages({
    "any.only": "TB testing completion must be confirmed",
  }),
  required_immunizations_current: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "any.only": "Required immunizations must be current",
    }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const ComplianceStatementForm = ({ onSubmit, isSubmitting }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: joiResolver(complianceSchema),
    defaultValues: {
      employee_name: user?.full_name || "",
      employee_id: user?.employee_id || "",
      position: user?.position || "",
      start_date: user?.start_date
        ? new Date(user.start_date).toISOString().split("T")[0]
        : "",
      signature_date: new Date().toISOString().split("T")[0],
    },
  });

  const handleFormSubmit = async (data) => {
    setError("");
    try {
      console.log("Submitting compliance statement:", data);
      await onSubmit(data);
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.error || "Failed to submit form. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
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
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
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

          <div>
            <label className="form-label">Position *</label>
            <input
              {...register("position")}
              type="text"
              className={`form-input ${
                errors.position ? "border-red-300" : ""
              }`}
              placeholder="Enter your position"
            />
            {errors.position && (
              <p className="form-error">{errors.position.message}</p>
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
        </div>
      </div>

      {/* Compliance Requirements */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Compliance Requirements
        </h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("background_check_completed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Background Check Completed *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that my background check has been completed and
                reviewed by HR.
              </p>
            </div>
          </div>
          {errors.background_check_completed && (
            <p className="form-error ml-7">
              {errors.background_check_completed.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("drug_screening_completed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Drug Screening Completed *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that my drug screening has been completed and results
                reviewed.
              </p>
            </div>
          </div>
          {errors.drug_screening_completed && (
            <p className="form-error ml-7">
              {errors.drug_screening_completed.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("licensure_verification")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Licensure Verification *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that all required professional licenses have been
                verified.
              </p>
            </div>
          </div>
          {errors.licensure_verification && (
            <p className="form-error ml-7">
              {errors.licensure_verification.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("tb_testing_completed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                TB Testing Completed *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that tuberculosis testing has been completed with
                negative results.
              </p>
            </div>
          </div>
          {errors.tb_testing_completed && (
            <p className="form-error ml-7">
              {errors.tb_testing_completed.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("required_immunizations_current")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Required Immunizations Current *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that all required immunizations are current and
                documentation provided.
              </p>
            </div>
          </div>
          {errors.required_immunizations_current && (
            <p className="form-error ml-7">
              {errors.required_immunizations_current.message}
            </p>
          )}
        </div>
      </div>

      {/* Electronic Signature */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Electronic Signature
        </h3>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-4">
            By typing your full name below and providing today's date, you are
            creating an electronic signature that is legally equivalent to a
            handwritten signature. This signature confirms that:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• All information provided above is true and accurate</li>
            <li>• You understand and comply with all stated requirements</li>
            <li>
              • You agree to notify HR immediately if any information changes
            </li>
          </ul>
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

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center px-6 py-3"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            "Submit Compliance Statement"
          )}
        </button>
      </div>
    </form>
  );
};

const ComplianceStatement = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting compliance statement:", data);
      await onboardingAPI.submitComplianceStatement(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormBase
      title="Compliance Statement"
      description="Complete this form to confirm that all pre-employment requirements have been met."
      onSubmit={handleSubmit}
    >
      <ComplianceStatementForm isSubmitting={isSubmitting} />
    </FormBase>
  );
};

export default ComplianceStatement;
