import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AlertCircle, Shield, Syringe, Calendar } from "lucide-react";

const hepatitisBSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  date_of_hire: Joi.date().required().messages({
    "date.base": "Date of hire is required",
  }),
  social_security_number: Joi.string().allow("").optional(),
  vaccine_choice: Joi.string().valid("waive", "receive").required().messages({
    "string.empty": "Vaccine choice is required",
    "any.only": "Please select either to receive or waive the vaccination",
  }),
  series_1_date: Joi.when("vaccine_choice", {
    is: "receive",
    then: Joi.date().required().messages({
      "date.base": "Series 1 date is required when receiving vaccination",
    }),
    otherwise: Joi.date().optional(),
  }),
  series_2_date: Joi.when("vaccine_choice", {
    is: "receive",
    then: Joi.date().optional(),
    otherwise: Joi.date().optional(),
  }),
  series_3_date: Joi.when("vaccine_choice", {
    is: "receive",
    then: Joi.date().optional(),
    otherwise: Joi.date().optional(),
  }),
  employee_signature: Joi.string().required().messages({
    "string.empty": "Employee signature is required",
  }),
  mmo_rep_signature: Joi.string().allow("").optional(),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const HepatitisBFormComponent = ({
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
    resolver: joiResolver(hepatitisBSchema),
    defaultValues: {
      employee_name: user?.full_name || "",
      date_of_hire: user?.start_date
        ? new Date(user.start_date).toISOString().split("T")[0]
        : "",
      signature_date: new Date().toISOString().split("T")[0],
    },
  });

  const vaccineChoice = watch("vaccine_choice");

  const handleFormSubmit = async (data, isDraft = false) => {
    setError("");
    try {
      await onSubmit(data, isDraft);
    } catch (err) {
      console.error("Form submission error:", err);
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
            <label className="form-label">Date of Hire *</label>
            <input
              {...register("date_of_hire")}
              type="date"
              className={`form-input ${
                errors.date_of_hire ? "border-red-300" : ""
              }`}
            />
            {errors.date_of_hire && (
              <p className="form-error">{errors.date_of_hire.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="form-label">
              Social Security Number (Optional)
            </label>
            <input
              {...register("social_security_number")}
              type="text"
              className={`form-input ${
                errors.social_security_number ? "border-red-300" : ""
              }`}
              placeholder="XXX-XX-XXXX"
            />
            <p className="text-xs text-gray-500 mt-1">
              This information is optional and will be securely stored for
              medical records
            </p>
            {errors.social_security_number && (
              <p className="form-error">
                {errors.social_security_number.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Vaccination Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Syringe className="w-5 h-5 mr-2 text-primary-600" />
          Hepatitis B Vaccination
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Hepatitis B Vaccination Information
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Due to occupational exposure risk, Hepatitis B vaccination is
                recommended for healthcare workers. The vaccination series
                consists of 3 doses given over 6 months. You may choose to
                receive the vaccination at no cost or waive it with proper
                documentation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Vaccination Choice *</label>
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  {...register("vaccine_choice")}
                  type="radio"
                  value="receive"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    I choose to receive the Hepatitis B vaccination series
                  </label>
                  <p className="text-sm text-gray-500">
                    I understand the vaccination will be provided at no cost and
                    consists of 3 doses
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  {...register("vaccine_choice")}
                  type="radio"
                  value="waive"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    I choose to waive the Hepatitis B vaccination
                  </label>
                  <p className="text-sm text-gray-500">
                    I understand the risks and decline the vaccination at this
                    time
                  </p>
                </div>
              </div>
            </div>
            {errors.vaccine_choice && (
              <p className="form-error">{errors.vaccine_choice.message}</p>
            )}
          </div>

          {vaccineChoice === "receive" && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Vaccination Schedule
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Series 1 Date *</label>
                  <input
                    {...register("series_1_date")}
                    type="date"
                    className={`form-input ${
                      errors.series_1_date ? "border-red-300" : ""
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">First dose</p>
                  {errors.series_1_date && (
                    <p className="form-error">{errors.series_1_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Series 2 Date</label>
                  <input
                    {...register("series_2_date")}
                    type="date"
                    className={`form-input ${
                      errors.series_2_date ? "border-red-300" : ""
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Second dose (1 month after first)
                  </p>
                  {errors.series_2_date && (
                    <p className="form-error">{errors.series_2_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Series 3 Date</label>
                  <input
                    {...register("series_3_date")}
                    type="date"
                    className={`form-input ${
                      errors.series_3_date ? "border-red-300" : ""
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Third dose (6 months after first)
                  </p>
                  {errors.series_3_date && (
                    <p className="form-error">{errors.series_3_date.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {vaccineChoice === "waive" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">
                    Vaccination Waiver Acknowledgment
                  </h4>
                  <div className="text-sm text-amber-700 mt-1">
                    <p className="mb-2">
                      By choosing to waive the Hepatitis B vaccination, I
                      acknowledge that:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        I understand the risks of Hepatitis B exposure in my
                        work environment
                      </li>
                      <li>
                        I have been informed about the benefits of vaccination
                      </li>
                      <li>
                        I may request vaccination at any time during my
                        employment
                      </li>
                      <li>This waiver does not affect my employment status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signatures */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Signatures
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Employee Signature *</label>
            <input
              {...register("employee_signature")}
              type="text"
              className={`form-input ${
                errors.employee_signature ? "border-red-300" : ""
              }`}
              placeholder="Type your full name"
            />
            <p className="text-xs text-gray-500 mt-1">
              Electronic signature confirming your vaccination choice
            </p>
            {errors.employee_signature && (
              <p className="form-error">{errors.employee_signature.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">MMO Representative Signature</label>
            <input
              {...register("mmo_rep_signature")}
              type="text"
              className={`form-input ${
                errors.mmo_rep_signature ? "border-red-300" : ""
              }`}
              placeholder="To be completed by MMO representative"
            />
            <p className="text-xs text-gray-500 mt-1">
              Medical officer signature (leave blank if not available)
            </p>
            {errors.mmo_rep_signature && (
              <p className="form-error">{errors.mmo_rep_signature.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
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
            "Submit Hepatitis B Form"
          )}
        </button>
      </div>
    </form>
  );
};

const HepatitisB = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitHepatitisB(data);
  };

  return (
    <FormBase
      title="Hepatitis B Vaccination Form"
      description="Complete this form to indicate your choice regarding Hepatitis B vaccination. This vaccination is recommended for healthcare workers due to potential occupational exposure."
      allowSaveDraft={true}
      onSubmit={handleSubmit}
    >
      <HepatitisBFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default HepatitisB;
