import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AlertCircle, Shield, Lock } from "lucide-react";

const confidentialitySchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  department: Joi.string().required().messages({
    "string.empty": "Department is required",
  }),
  maintain_confidentiality: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to maintain confidentiality",
  }),
  no_solicitation_agreement: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the no solicitation terms",
  }),
  privacy_regulations_compliance: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "any.only": "You must agree to comply with privacy regulations",
    }),
  hipaa_compliance_acknowledgment: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "any.only": "HIPAA compliance acknowledgment is required",
    }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const ConfidentialityAgreementForm = ({
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
    resolver: joiResolver(confidentialitySchema),
    defaultValues: {
      employee_name: user?.full_name || "",
      employee_id: user?.employee_id || "",
      department: user?.department || "",
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
          <Shield className="w-5 h-5 mr-2 text-primary-600" />
          Employee Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <label className="form-label">Department *</label>
            <input
              {...register("department")}
              type="text"
              className={`form-input ${
                errors.department ? "border-red-300" : ""
              }`}
              placeholder="Enter your department"
            />
            {errors.department && (
              <p className="form-error">{errors.department.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Confidentiality Agreement Terms */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-primary-600" />
          Confidentiality Agreement Terms
        </h3>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-4">
              By signing this agreement, you acknowledge and agree to the
              following terms regarding confidential information and privacy
              protection:
            </p>

            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li>
                You will maintain strict confidentiality of all proprietary
                information
              </li>
              <li>
                You will not disclose confidential information to unauthorized
                parties
              </li>
              <li>
                You will comply with all applicable privacy regulations
                including HIPAA
              </li>
              <li>
                You will not solicit clients or employees for competing purposes
              </li>
              <li>
                You understand violations may result in legal action and
                termination
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("maintain_confidentiality")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Confidentiality Commitment *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I agree to maintain strict confidentiality of all proprietary,
                sensitive, and confidential information that I may have access
                to during my employment.
              </p>
            </div>
          </div>
          {errors.maintain_confidentiality && (
            <p className="form-error ml-7">
              {errors.maintain_confidentiality.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("no_solicitation_agreement")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                No Solicitation Agreement *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I agree not to solicit company clients, customers, or employees
                for competing business purposes during and after my employment.
              </p>
            </div>
          </div>
          {errors.no_solicitation_agreement && (
            <p className="form-error ml-7">
              {errors.no_solicitation_agreement.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("privacy_regulations_compliance")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Privacy Regulations Compliance *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I agree to comply with all applicable privacy regulations,
                including but not limited to HIPAA, GDPR, and company privacy
                policies.
              </p>
            </div>
          </div>
          {errors.privacy_regulations_compliance && (
            <p className="form-error ml-7">
              {errors.privacy_regulations_compliance.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("hipaa_compliance_acknowledgment")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                HIPAA Compliance Acknowledgment *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I acknowledge understanding of HIPAA requirements and agree to
                protect all protected health information (PHI) in accordance
                with federal regulations.
              </p>
            </div>
          </div>
          {errors.hipaa_compliance_acknowledgment && (
            <p className="form-error ml-7">
              {errors.hipaa_compliance_acknowledgment.message}
            </p>
          )}
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
                Legal Binding Agreement
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                By providing your electronic signature below, you are creating a
                legally binding agreement. This signature confirms that you have
                read, understood, and agree to all terms stated above.
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
              Type your full legal name as it appears on official documents
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
            "Submit Confidentiality Agreement"
          )}
        </button>
      </div>
    </form>
  );
};

const ConfidentialityAgreement = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      // Handle draft save - you could implement a separate API endpoint for drafts
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitConfidentialityAgreement(data);
  };

  return (
    <FormBase
      title="Confidentiality Agreement"
      description="Please review and sign the confidentiality and non-disclosure agreement to protect sensitive company and client information."
      allowSaveDraft={true}
      onSubmit={handleSubmit}
    >
      <ConfidentialityAgreementForm onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default ConfidentialityAgreement;
