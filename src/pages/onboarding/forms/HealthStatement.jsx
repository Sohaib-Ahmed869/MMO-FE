import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AlertCircle, Heart, User, Phone } from "lucide-react";

const healthStatementSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  chronic_medical_conditions: Joi.string().allow("").optional(),
  current_medications: Joi.string().allow("").optional(),
  known_allergies: Joi.string().allow("").optional(),
  immunizations_current: Joi.boolean().valid(true).required().messages({
    "any.only": "You must confirm your immunizations are current",
  }),
  tb_screening_completed: Joi.boolean().valid(true).required().messages({
    "any.only": "TB screening completion is required",
  }),
  health_insurance_coverage: Joi.boolean().required().messages({
    "any.required": "Please specify your health insurance status",
  }),
  emergency_contact_name: Joi.string().required().messages({
    "string.empty": "Emergency contact name is required",
  }),
  emergency_contact_phone: Joi.string().required().messages({
    "string.empty": "Emergency contact phone is required",
  }),
  emergency_contact_relationship: Joi.string().required().messages({
    "string.empty": "Emergency contact relationship is required",
  }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),

  // Additional fields can be added as needed
  
});

const HealthStatementFormComponent = ({
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
    resolver: joiResolver(healthStatementSchema),
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

      {/* Employee Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" />
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

      {/* Medical Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-primary-600" />
          Medical Information
        </h3>

        <div className="space-y-6">
          <div>
            <label className="form-label">Chronic Medical Conditions</label>
            <textarea
              {...register("chronic_medical_conditions")}
              rows="3"
              className={`form-input ${
                errors.chronic_medical_conditions ? "border-red-300" : ""
              }`}
              placeholder="List any chronic medical conditions (leave blank if none)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please list any ongoing medical conditions that may affect your
              work
            </p>
            {errors.chronic_medical_conditions && (
              <p className="form-error">
                {errors.chronic_medical_conditions.message}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Current Medications</label>
            <textarea
              {...register("current_medications")}
              rows="3"
              className={`form-input ${
                errors.current_medications ? "border-red-300" : ""
              }`}
              placeholder="List current medications (leave blank if none)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include prescription and over-the-counter medications
            </p>
            {errors.current_medications && (
              <p className="form-error">{errors.current_medications.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Known Allergies</label>
            <textarea
              {...register("known_allergies")}
              rows="3"
              className={`form-input ${
                errors.known_allergies ? "border-red-300" : ""
              }`}
              placeholder="List any known allergies (leave blank if none)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include drug allergies, food allergies, environmental allergies,
              etc.
            </p>
            {errors.known_allergies && (
              <p className="form-error">{errors.known_allergies.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Health Requirements */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Health Requirements
        </h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("immunizations_current")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Current Immunizations *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that my immunizations are current and up-to-date as
                required for this position.
              </p>
            </div>
          </div>
          {errors.immunizations_current && (
            <p className="form-error ml-7">
              {errors.immunizations_current.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("tb_screening_completed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                TB Screening Completed *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that I have completed the required tuberculosis
                screening.
              </p>
            </div>
          </div>
          {errors.tb_screening_completed && (
            <p className="form-error ml-7">
              {errors.tb_screening_completed.message}
            </p>
          )}

          <div>
            <label className="form-label">Health Insurance Coverage *</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  {...register("health_insurance_coverage")}
                  type="radio"
                  value="true"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Yes, I have health insurance coverage
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  {...register("health_insurance_coverage")}
                  type="radio"
                  value="false"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    No, I do not have health insurance coverage
                  </label>
                </div>
              </div>
            </div>
            {errors.health_insurance_coverage && (
              <p className="form-error">
                {errors.health_insurance_coverage.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-primary-600" />
          Emergency Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="form-label">Emergency Contact Name *</label>
            <input
              {...register("emergency_contact_name")}
              type="text"
              className={`form-input ${
                errors.emergency_contact_name ? "border-red-300" : ""
              }`}
              placeholder="Full name"
            />
            {errors.emergency_contact_name && (
              <p className="form-error">
                {errors.emergency_contact_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Phone Number *</label>
            <input
              {...register("emergency_contact_phone")}
              type="tel"
              className={`form-input ${
                errors.emergency_contact_phone ? "border-red-300" : ""
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.emergency_contact_phone && (
              <p className="form-error">
                {errors.emergency_contact_phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Relationship *</label>
            <input
              {...register("emergency_contact_relationship")}
              type="text"
              className={`form-input ${
                errors.emergency_contact_relationship ? "border-red-300" : ""
              }`}
              placeholder="e.g., Spouse, Parent, Sibling"
            />
            {errors.emergency_contact_relationship && (
              <p className="form-error">
                {errors.emergency_contact_relationship.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Electronic Signature */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Electronic Signature
        </h3>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                Certification Statement
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                I certify that the health information provided above is true and
                complete to the best of my knowledge. I understand that any
                false information may result in denial of employment or
                termination.
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
              Type your full legal name as your electronic signature
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
            "Submit Health Statement"
          )}
        </button>
      </div>
    </form>
  );
};

const HealthStatement = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitHealthStatement(data);
  };

  return (
    <FormBase
      title="Health Statement"
      description="Please provide your health information and emergency contact details. This information is confidential and will be used for workplace safety and emergency purposes only."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <HealthStatementFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default HealthStatement;
