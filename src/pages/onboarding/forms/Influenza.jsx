import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AlertCircle, Shield, Thermometer, User } from "lucide-react";

const influenzaDeclinationSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  acknowledgment_read: Joi.boolean().valid(true).required().messages({
    "any.only": "You must acknowledge reading the influenza information",
  }),
  mask_requirement_understood: Joi.boolean().valid(true).required().messages({
    "any.only": "You must acknowledge understanding the mask requirement",
  }),
  declination_signature: Joi.string().required().messages({
    "string.empty": "Declination signature is required",
  }),
  witness_signature: Joi.string().allow("").optional(),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
  witness_date: Joi.date().allow(null).optional(),
});

const InfluenzaDeclinationFormComponent = ({
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
    resolver: joiResolver(influenzaDeclinationSchema),
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

      {/* Influenza Vaccination Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Thermometer className="w-5 h-5 mr-2 text-primary-600" />
          Influenza Vaccination Declination
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Important Information About Influenza Vaccination
              </h4>
              <div className="text-sm text-yellow-700 mt-2 space-y-2">
                <p>
                  <strong>Why vaccination is recommended:</strong> Annual
                  influenza vaccination is strongly recommended for all
                  healthcare workers to protect both employees and patients from
                  influenza transmission.
                </p>
                <p>
                  <strong>Benefits of vaccination:</strong> Reduces risk of
                  influenza illness, decreases severity of symptoms if infection
                  occurs, and helps protect vulnerable patient populations.
                </p>
                <p>
                  <strong>Vaccination availability:</strong> The influenza
                  vaccine is provided at no cost to employees and is typically
                  available from October through March.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Declination Acknowledgment
              </h4>
              <div className="text-sm text-red-700 mt-2 space-y-2">
                <p>
                  By declining the influenza vaccination, I acknowledge and
                  understand that:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>I am at increased risk of acquiring influenza</li>
                  <li>
                    If I acquire influenza, I may spread the disease to others
                  </li>
                  <li>
                    I may be putting patients, coworkers, and family members at
                    risk
                  </li>
                  <li>
                    I understand the benefits and safety of the influenza
                    vaccine
                  </li>
                  <li>
                    I may reconsider and accept vaccination at any time during
                    the flu season
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Mask Requirement During Influenza Season
              </h4>
              <div className="text-sm text-blue-700 mt-2">
                <p className="mb-2">
                  <strong>Important:</strong> Employees who decline influenza
                  vaccination must wear a surgical mask during patient care
                  activities throughout the entire influenza season (typically
                  October 1 through March 31).
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Masks must be worn whenever providing direct patient care
                  </li>
                  <li>Masks must be worn in patient care areas</li>
                  <li>
                    Failure to comply with masking requirements may result in
                    disciplinary action
                  </li>
                  <li>
                    This requirement helps protect patients and coworkers from
                    potential transmission
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgments */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Required Acknowledgments
        </h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("acknowledgment_read")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Information Acknowledgment *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I acknowledge that I have read and understood the information
                about influenza vaccination, including the benefits of
                vaccination and the risks of declining vaccination.
              </p>
            </div>
          </div>
          {errors.acknowledgment_read && (
            <p className="form-error ml-7">
              {errors.acknowledgment_read.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register("mask_requirement_understood")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Mask Requirement Understanding *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I understand that by declining the influenza vaccine, I will be
                required to wear a surgical mask during all patient care
                activities throughout the entire influenza season.
              </p>
            </div>
          </div>
          {errors.mask_requirement_understood && (
            <p className="form-error ml-7">
              {errors.mask_requirement_understood.message}
            </p>
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
            <label className="form-label">
              Employee Declination Signature *
            </label>
            <input
              {...register("declination_signature")}
              type="text"
              className={`form-input ${
                errors.declination_signature ? "border-red-300" : ""
              }`}
              placeholder="Type your full name"
            />
            <p className="text-xs text-gray-500 mt-1">
              Electronic signature declining influenza vaccination
            </p>
            {errors.declination_signature && (
              <p className="form-error">
                {errors.declination_signature.message}
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

          <div>
            <label className="form-label">Witness Signature</label>
            <input
              {...register("witness_signature")}
              type="text"
              className={`form-input ${
                errors.witness_signature ? "border-red-300" : ""
              }`}
              placeholder="Witness signature (if required)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - supervisor or HR representative witness
            </p>
            {errors.witness_signature && (
              <p className="form-error">{errors.witness_signature.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Witness Date</label>
            <input
              {...register("witness_date")}
              type="date"
              className={`form-input ${
                errors.witness_date ? "border-red-300" : ""
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Date witnessed (if applicable)
            </p>
            {errors.witness_date && (
              <p className="form-error">{errors.witness_date.message}</p>
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
            "Submit Declination Form"
          )}
        </button>
      </div>
    </form>
  );
};

const InfluenzaDeclination = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitInfluenzaDeclination(data);
  };

  return (
    <FormBase
      title="Influenza Vaccination Declination Form"
      description="Complete this form if you choose to decline the annual influenza vaccination. Please read all information carefully and understand the requirements for unvaccinated employees."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <InfluenzaDeclinationFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default InfluenzaDeclination;
