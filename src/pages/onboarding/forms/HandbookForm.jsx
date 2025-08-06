import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Book } from "lucide-react";
import FormBase from "../../../components/FormBase";
// Employee Handbook Acknowledgment Form
const handbookSchema = Joi.object({
  employee_name: Joi.string()
    .required()
    .messages({ "string.empty": "Employee name is required" }),
  employee_id: Joi.string()
    .required()
    .messages({ "string.empty": "Employee ID is required" }),
  handbook_received: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm handbook receipt" }),
  handbook_read: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm reading the handbook" }),
  policies_understood: Joi.boolean()
    .valid(true)
    .required()
    .messages({ "any.only": "You must confirm understanding policies" }),
  electronic_signature: Joi.string()
    .required()
    .messages({ "string.empty": "Electronic signature is required" }),
  signature_date: Joi.date()
    .required()
    .messages({ "date.base": "Signature date is required" }),
});

const HandbookFormComponent = ({
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
    resolver: joiResolver(handbookSchema),
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
          Employee Handbook Acknowledgment
        </h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-green-800 mb-3">
            Employee Handbook
          </h4>
          <p className="text-sm text-green-700">
            The employee handbook contains important information about company
            policies, benefits, expectations, and your rights as an employee.
            Please confirm that you have received and reviewed this important
            document.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("handbook_received")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Handbook Received *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I have received a copy of the employee handbook (electronic or
                physical).
              </p>
            </div>
          </div>
          {errors.handbook_received && (
            <p className="form-error ml-7">
              {errors.handbook_received.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("handbook_read")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Handbook Read *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I have read and reviewed the employee handbook in its entirety.
              </p>
            </div>
          </div>
          {errors.handbook_read && (
            <p className="form-error ml-7">{errors.handbook_read.message}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("policies_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Policies Understood *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I understand the policies outlined in the handbook and agree to
                comply with them.
              </p>
            </div>
          </div>
          {errors.policies_understood && (
            <p className="form-error ml-7">
              {errors.policies_understood.message}
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
            "Submit Handbook Acknowledgment"
          )}
        </button>
      </div>
    </form>
  );
};

export const HandbookAcknowledgment = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitHandbookAcknowledgment(data);
  };

  return (
    <FormBase
      title="Employee Handbook Acknowledgment"
      description="Confirm receipt and understanding of the employee handbook."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <HandbookFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};
