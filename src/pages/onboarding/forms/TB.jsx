import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../../contexts/AuthContext";
import { onboardingAPI } from "../../../services/api";
import FormBase from "../../../components/FormBase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AlertCircle, Activity, Stethoscope, FileText } from "lucide-react";

// TB Medical Questionnaire Form
const tbSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  tb_symptoms_present: Joi.boolean().required().messages({
    "any.required": "Please indicate if TB symptoms are present",
  }),
  tb_exposure_history: Joi.boolean().required().messages({
    "any.required": "Please indicate TB exposure history",
  }),
  chest_xray_completed: Joi.boolean().valid(true).required().messages({
    "any.only": "Chest X-ray completion is required",
  }),
  medical_clearance: Joi.boolean().valid(true).required().messages({
    "any.only": "Medical clearance confirmation is required",
  }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const TBFormComponent = ({ onSubmit, onSaveDraft, isSubmitting, isSaving }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(tbSchema),
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
          <Activity className="w-5 h-5 mr-2 text-primary-600" />
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

      {/* TB Medical Questionnaire */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-primary-600" />
          TB Medical Questionnaire
        </h3>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-3">
                Tuberculosis Screening Requirements
              </h4>
              <p className="text-sm text-red-700 mb-3">
                All healthcare workers must complete TB screening before
                beginning patient care activities. This includes symptom
                assessment, exposure history, and medical clearance.
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Chest X-ray within the last 12 months</li>
                <li>
                  Medical evaluation if symptoms or risk factors are present
                </li>
                <li>Annual reassessment required for continued employment</li>
                <li>Immediate reporting of any TB symptoms or exposure</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* TB Symptoms */}
          <div>
            <label className="form-label">TB Symptoms Present *</label>
            <p className="text-sm text-gray-600 mb-3">
              Do you currently have any of the following symptoms: persistent
              cough (≥3 weeks), fever, night sweats, unexplained weight loss,
              fatigue, or chest pain?
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  {...register("tb_symptoms_present")}
                  type="radio"
                  value="true"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Yes, I have one or more TB symptoms
                  </label>
                  <p className="text-sm text-gray-500">
                    Persistent cough, fever, night sweats, weight loss, fatigue,
                    or chest pain
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  {...register("tb_symptoms_present")}
                  type="radio"
                  value="false"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    No, I do not have any TB symptoms
                  </label>
                </div>
              </div>
            </div>
            {errors.tb_symptoms_present && (
              <p className="form-error">{errors.tb_symptoms_present.message}</p>
            )}
          </div>

          {/* TB Exposure History */}
          <div>
            <label className="form-label">TB Exposure History *</label>
            <p className="text-sm text-gray-600 mb-3">
              Have you had known contact with someone diagnosed with active
              tuberculosis, or lived/worked in high-risk settings for TB
              transmission?
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  {...register("tb_exposure_history")}
                  type="radio"
                  value="true"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Yes, I have been exposed to TB or worked in high-risk
                    settings
                  </label>
                  <p className="text-sm text-gray-500">
                    Known contact with active TB case, correctional facilities,
                    homeless shelters, etc.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  {...register("tb_exposure_history")}
                  type="radio"
                  value="false"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    No, I have not been exposed to TB or worked in high-risk
                    settings
                  </label>
                </div>
              </div>
            </div>
            {errors.tb_exposure_history && (
              <p className="form-error">{errors.tb_exposure_history.message}</p>
            )}
          </div>

          {/* Medical Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h4 className="text-md font-medium text-blue-800 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Required Medical Documentation
            </h4>

            <div className="flex items-start space-x-3">
              <input
                {...register("chest_xray_completed")}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Chest X-ray Completed *
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  I have completed a chest X-ray within the last 12 months and
                  the results are normal. Documentation has been provided to the
                  medical office.
                </p>
              </div>
            </div>
            {errors.chest_xray_completed && (
              <p className="form-error ml-7">
                {errors.chest_xray_completed.message}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <input
                {...register("medical_clearance")}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Medical Clearance Obtained *
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  I have received medical clearance for employment and patient
                  care activities. Any required follow-up testing or treatment
                  has been completed or scheduled.
                </p>
              </div>
            </div>
            {errors.medical_clearance && (
              <p className="form-error ml-7">
                {errors.medical_clearance.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                Important Reminders
              </h4>
              <div className="text-sm text-amber-700 mt-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Report any new TB symptoms immediately to your supervisor
                    and occupational health
                  </li>
                  <li>
                    Annual TB screening is required for continued employment
                  </li>
                  <li>
                    Any changes in health status must be reported promptly
                  </li>
                  <li>
                    Additional testing may be required based on risk assessment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Electronic Signature */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Electronic Signature
        </h3>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <Activity className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                TB Screening Certification
              </h4>
              <p className="text-sm text-green-700 mt-1">
                By signing below, I certify that all information provided is
                true and complete. I understand my responsibility to report any
                changes in my health status or TB exposure.
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
              Type your full legal name to certify the accuracy of this
              information
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
            "Submit TB Questionnaire"
          )}
        </button>
      </div>
    </form>
  );
};

const TBQuestionnaire = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitTBQuestionnaire(data);
  };

  return (
    <FormBase
      title="TB Medical Questionnaire"
      description="Complete the tuberculosis screening questionnaire and confirm medical clearance for employment. This screening is required for all healthcare workers before beginning patient care activities."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <TBFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default TBQuestionnaire;
