import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AlertCircle, MapPin, Shield, CheckCircle } from "lucide-react";

const fieldPracticeSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  practice_guidelines_acknowledged: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "any.only": "You must acknowledge the practice guidelines",
    }),
  field_procedures_understood: Joi.boolean().valid(true).required().messages({
    "any.only": "You must confirm understanding of field procedures",
  }),
  safety_protocols_agreed: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to follow safety protocols",
  }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const FieldPracticeFormComponent = ({
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
    resolver: joiResolver(fieldPracticeSchema),
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
          <MapPin className="w-5 h-5 mr-2 text-primary-600" />
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

      {/* Field Practice Guidelines */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary-600" />
          Field Practice Guidelines
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="prose prose-sm max-w-none text-gray-700">
            <h4 className="text-md font-medium text-blue-800 mb-3">
              Field Work Standards and Expectations
            </h4>

            <p className="mb-4">
              As a field-based employee, you are expected to maintain the
              highest standards of professionalism and safety. Please review the
              following guidelines:
            </p>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-800">
                  Professional Conduct
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Maintain professional appearance and behavior at all times
                  </li>
                  <li>Respect client property and privacy</li>
                  <li>
                    Follow all company policies while representing the
                    organization
                  </li>
                  <li>
                    Communicate professionally with clients, colleagues, and
                    supervisors
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800">Safety Protocols</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Wear appropriate personal protective equipment (PPE) as
                    required
                  </li>
                  <li>Follow all safety procedures and protocols</li>
                  <li>Report any safety incidents or hazards immediately</li>
                  <li>
                    Maintain situational awareness and practice defensive safety
                    measures
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800">
                  Documentation and Reporting
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Complete all required documentation accurately and timely
                  </li>
                  <li>Submit reports according to established schedules</li>
                  <li>
                    Maintain confidentiality of all client and company
                    information
                  </li>
                  <li>
                    Follow proper procedures for handling sensitive materials
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800">
                  Equipment and Vehicle Use
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use company equipment and vehicles responsibly</li>
                  <li>
                    Perform daily equipment checks and maintenance as required
                  </li>
                  <li>
                    Report any equipment malfunctions or damage immediately
                  </li>
                  <li>Follow all traffic laws and safe driving practices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgments */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-primary-600" />
          Acknowledgments and Agreements
        </h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("practice_guidelines_acknowledged")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Practice Guidelines Acknowledgment *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I acknowledge that I have read, understood, and agree to follow
                all field practice guidelines as outlined above. I understand
                that these guidelines are essential for maintaining professional
                standards and ensuring quality service delivery.
              </p>
            </div>
          </div>
          {errors.practice_guidelines_acknowledged && (
            <p className="form-error ml-7">
              {errors.practice_guidelines_acknowledged.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("field_procedures_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Field Procedures Understanding *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I confirm that I understand all field procedures, documentation
                requirements, and reporting protocols. I commit to following
                established procedures and seeking clarification when needed.
              </p>
            </div>
          </div>
          {errors.field_procedures_understood && (
            <p className="form-error ml-7">
              {errors.field_procedures_understood.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("safety_protocols_agreed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Safety Protocols Agreement *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I agree to follow all safety protocols and procedures while
                performing field work. I understand that safety is my
                responsibility and that I must report any safety concerns or
                incidents immediately to my supervisor.
              </p>
            </div>
          </div>
          {errors.safety_protocols_agreed && (
            <p className="form-error ml-7">
              {errors.safety_protocols_agreed.message}
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
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                Field Practice Commitment
              </h4>
              <p className="text-sm text-green-700 mt-1">
                By signing below, you confirm your commitment to following all
                field practice guidelines, procedures, and safety protocols
                outlined in this document.
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
              Type your full legal name to confirm your agreement
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
            "Submit Field Practice Statement"
          )}
        </button>
      </div>
    </form>
  );
};

const FieldPractice = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitFieldPractice(data);
  };

  return (
    <FormBase
      title="Field Practice Statement"
      description="Please review and acknowledge the field practice guidelines, procedures, and safety protocols. This ensures you understand the standards expected while working in field locations."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <FieldPracticeFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default FieldPractice;
