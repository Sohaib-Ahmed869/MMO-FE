import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Book } from "lucide-react";
import FormBase from "../../../components/FormBase";
import { Shield } from "lucide-react";
// PPE Acknowledgement Form
const ppeSchema = Joi.object({
  employee_name: Joi.string()
    .required()
    .messages({ "string.empty": "Employee name is required" }),
  employee_id: Joi.string()
    .required()
    .messages({ "string.empty": "Employee ID is required" }),
  ppe_training_completed: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm PPE training completion" }),
  equipment_received: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm equipment receipt" }),
  usage_guidelines_understood: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "any.only": "You must acknowledge understanding usage guidelines",
    }),
  electronic_signature: Joi.string()
    .required()
    .messages({ "string.empty": "Electronic signature is required" }),
  signature_date: Joi.date()
    .required()
    .messages({ "date.base": "Signature date is required" }),
});

const PPEFormComponent = ({
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
    resolver: joiResolver(ppeSchema),
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
          <Shield className="w-5 h-5 mr-2 text-primary-600" />
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
          PPE Requirements
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-yellow-800 mb-3">
            Personal Protective Equipment Guidelines
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>All PPE must be worn according to established protocols</li>
            <li>Equipment must be inspected before each use</li>
            <li>Damaged or worn equipment must be reported immediately</li>
            <li>Proper cleaning and storage procedures must be followed</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("ppe_training_completed")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                PPE Training Completed *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I have completed all required PPE training and understand proper
                usage procedures.
              </p>
            </div>
          </div>
          {errors.ppe_training_completed && (
            <p className="form-error ml-7">
              {errors.ppe_training_completed.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("equipment_received")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Equipment Received *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I have received all required personal protective equipment for
                my position.
              </p>
            </div>
          </div>
          {errors.equipment_received && (
            <p className="form-error ml-7">
              {errors.equipment_received.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("usage_guidelines_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Usage Guidelines Understanding *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I understand and will follow all PPE usage guidelines and safety
                protocols.
              </p>
            </div>
          </div>
          {errors.usage_guidelines_understood && (
            <p className="form-error ml-7">
              {errors.usage_guidelines_understood.message}
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
            "Submit PPE Acknowledgement"
          )}
        </button>
      </div>
    </form>
  );
};

export const PPEAcknowledgement = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitPPEAcknowledgement(data);
  };

  return (
    <FormBase
      title="PPE Acknowledgement"
      description="Confirm receipt and understanding of personal protective equipment requirements and training."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <PPEFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};
