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
  CreditCard,
  Building,
  DollarSign,
  Info,
} from "lucide-react";

const directDepositSchema = Joi.object({
  employee_name: Joi.string().required().messages({
    "string.empty": "Employee name is required",
  }),
  employee_id: Joi.string().required().messages({
    "string.empty": "Employee ID is required",
  }),
  bank_name: Joi.string().required().messages({
    "string.empty": "Bank name is required",
  }),
  routing_number: Joi.string().length(9).pattern(/^\d+$/).required().messages({
    "string.empty": "Routing number is required",
    "string.length": "Routing number must be exactly 9 digits",
    "string.pattern.base": "Routing number must contain only numbers",
  }),
  account_number: Joi.string()
    .min(4)
    .max(20)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.empty": "Account number is required",
      "string.min": "Account number must be at least 4 digits",
      "string.max": "Account number cannot exceed 20 digits",
      "string.pattern.base": "Account number must contain only numbers",
    }),
  confirm_account_number: Joi.string()
    .valid(Joi.ref("account_number"))
    .required()
    .messages({
      "any.only": "Account numbers do not match",
      "string.empty": "Please confirm your account number",
    }),
  account_type: Joi.string().valid("checking", "savings").required().messages({
    "string.empty": "Account type is required",
    "any.only": "Please select either checking or savings",
  }),
  deposit_type: Joi.string()
    .valid("full_amount", "partial_amount")
    .required()
    .messages({
      "string.empty": "Deposit type is required",
    }),
  deposit_amount: Joi.when("deposit_type", {
    is: "partial_amount",
    then: Joi.number().positive().required().messages({
      "number.positive": "Deposit amount must be positive",
      "any.required": "Deposit amount is required for partial deposits",
    }),
    otherwise: Joi.optional(),
  }),
  authorization_agreement: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the authorization terms",
  }),
  electronic_signature: Joi.string().required().messages({
    "string.empty": "Electronic signature is required",
  }),
  signature_date: Joi.date().required().messages({
    "date.base": "Signature date is required",
  }),
});

const DirectDepositFormComponent = ({
  onSubmit,
  onSaveDraft,
  isSubmitting,
  isSaving,
}) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(directDepositSchema),
    defaultValues: {
      employee_name: user?.full_name || "",
      employee_id: user?.employee_id || "",
      deposit_type: "full_amount",
      signature_date: new Date().toISOString().split("T")[0],
    },
  });

  const depositType = watch("deposit_type");
  const accountNumber = watch("account_number");

  const handleFormSubmit = async (data, isDraft = false) => {
    setError("");
    try {
      // Remove confirm_account_number before submitting
      const { confirm_account_number, ...submitData } = data;
      await onSubmit(submitData, isDraft);
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
          <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
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

      {/* Banking Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <Building className="w-5 h-5 mr-2 text-primary-600" />
          Banking Information
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Banking Information Security
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Your banking information is encrypted and securely stored. This
                information will only be used for direct deposit purposes and
                will not be shared with unauthorized parties.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="form-label">Bank Name *</label>
            <input
              {...register("bank_name")}
              type="text"
              className={`form-input ${
                errors.bank_name ? "border-red-300" : ""
              }`}
              placeholder="e.g., Chase Bank, Bank of America"
            />
            {errors.bank_name && (
              <p className="form-error">{errors.bank_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Routing Number *</label>
              <input
                {...register("routing_number")}
                type="text"
                maxLength="9"
                className={`form-input ${
                  errors.routing_number ? "border-red-300" : ""
                }`}
                placeholder="9-digit routing number"
              />
              <p className="text-xs text-gray-500 mt-1">
                Found at the bottom left of your check or online banking
              </p>
              {errors.routing_number && (
                <p className="form-error">{errors.routing_number.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Account Type *</label>
              <select
                {...register("account_type")}
                className={`form-input ${
                  errors.account_type ? "border-red-300" : ""
                }`}
              >
                <option value="">Select account type</option>
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
              </select>
              {errors.account_type && (
                <p className="form-error">{errors.account_type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Account Number *</label>
              <div className="relative">
                <input
                  {...register("account_number")}
                  type={showAccountNumber ? "text" : "password"}
                  className={`form-input pr-20 ${
                    errors.account_number ? "border-red-300" : ""
                  }`}
                  placeholder="Enter your account number"
                />
                <button
                  type="button"
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  {showAccountNumber ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Found at the bottom of your check after the routing number
              </p>
              {errors.account_number && (
                <p className="form-error">{errors.account_number.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Confirm Account Number *</label>
              <input
                {...register("confirm_account_number")}
                type="text"
                className={`form-input ${
                  errors.confirm_account_number ? "border-red-300" : ""
                }`}
                placeholder="Re-enter your account number"
              />
              {errors.confirm_account_number && (
                <p className="form-error">
                  {errors.confirm_account_number.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
          Deposit Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label className="form-label">Deposit Type *</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  {...register("deposit_type")}
                  type="radio"
                  value="full_amount"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Full Amount
                  </label>
                  <p className="text-sm text-gray-500">
                    Deposit entire net pay amount into this account
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  {...register("deposit_type")}
                  type="radio"
                  value="partial_amount"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Partial Amount
                  </label>
                  <p className="text-sm text-gray-500">
                    Deposit a specific dollar amount into this account
                  </p>
                </div>
              </div>
            </div>
            {errors.deposit_type && (
              <p className="form-error">{errors.deposit_type.message}</p>
            )}
          </div>

          {depositType === "partial_amount" && (
            <div>
              <label className="form-label">Deposit Amount *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  {...register("deposit_amount", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input pl-8 ${
                    errors.deposit_amount ? "border-red-300" : ""
                  }`}
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the specific dollar amount to deposit per pay period
              </p>
              {errors.deposit_amount && (
                <p className="form-error">{errors.deposit_amount.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Authorization */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Authorization Agreement
        </h3>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Direct Deposit Authorization:</strong> I hereby authorize
              my employer to deposit my net pay (or specified amount) directly
              into the account specified above. I understand that:
            </p>

            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>
                This authorization will remain in effect until I provide written
                notice to change it
              </li>
              <li>
                It may take 1-2 pay periods for direct deposit to become
                effective
              </li>
              <li>
                I will receive a pay statement for each deposit transaction
              </li>
              <li>
                The company reserves the right to limit the number of accounts
                for deposit
              </li>
              <li>
                I am responsible for notifying HR of any changes to my banking
                information
              </li>
            </ul>

            <p>
              <strong>Account Verification:</strong> I certify that the banking
              information provided is accurate and that I am authorized to use
              this account for direct deposit purposes.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register("authorization_agreement")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Authorization Agreement *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I authorize direct deposit according to the terms stated above
                and certify that all information provided is accurate and
                complete.
              </p>
            </div>
          </div>
          {errors.authorization_agreement && (
            <p className="form-error ml-7">
              {errors.authorization_agreement.message}
            </p>
          )}
        </div>
      </div>

      {/* Electronic Signature */}
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
            <p className="text-xs text-gray-500 mt-1">
              Type your full legal name as it appears on your bank account
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
            "Submit Direct Deposit Authorization"
          )}
        </button>
      </div>
    </form>
  );
};

const DirectDepositForm = () => {
  const handleSubmit = async (data, isDraft = false) => {
    if (isDraft) {
      console.log("Saving draft:", data);
      return;
    }
    await onboardingAPI.submitDirectDeposit(data);
  };

  return (
    <FormBase
      title="Direct Deposit Authorization"
      description="Set up direct deposit to receive your salary directly in your bank account. This is a secure and convenient way to receive your pay."
      allowSaveDraft={true}
      onSubmit={handleSubmit}

    >
      <DirectDepositFormComponent onSubmit={handleSubmit} />
    </FormBase>
  );
};

export default DirectDepositForm;
