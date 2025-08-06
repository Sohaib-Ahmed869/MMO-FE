import React from "react";
import {
  X,
  CheckCircle,
  Calendar,
  User,
  FileText,
  Download,
  
} from "lucide-react";

const FormDetailsModal = ({ isOpen, onClose, formData, formType }) => {
  if (!isOpen || !formData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBoolean = (value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "Not specified";
  };

  const getFormTitle = (type) => {
    const titles = {
      compliance_statements: "Compliance Statement",
      confidentiality_agreements: "Confidentiality Agreement",
      direct_deposit_authorizations: "Direct Deposit Authorization",
      health_statements: "Health Statement",
      hepatitis_b_vaccinations: "Hepatitis B Vaccination Form",
      field_practice_statements: "Field Practice Statement",
      influenza_vaccination_declinations: "Influenza Vaccination Declination",
      job_acceptance_forms: "Job Acceptance Form",
      job_description_acknowledgments: "Job Description Acknowledgment",
      ppe_acknowledgements: "PPE Acknowledgement",
      policies_procedures_statements: "Policies & Procedures Statement",
      employee_handbook_acknowledgments: "Employee Handbook Acknowledgment",
      tb_medical_questionnaires: "TB Medical Questionnaire",
    };
    return titles[type] || "Form Details";
  };

  const renderFormFields = () => {
    const excludeFields = ["id", "user_id", "created_at", "updated_at"];

    return Object.entries(formData)
      .filter(([key]) => !excludeFields.includes(key))
      .map(([key, value]) => {
        const fieldName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div
            key={key}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="font-medium text-gray-700">{fieldName}</div>
            <div className="md:col-span-2 text-gray-900">
              {key.includes("date") && value ? (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(value)}
                </div>
              ) : key.includes("signature") && value ? (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{value}</span>
                </div>
              ) : typeof value === "boolean" ? (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    value
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formatBoolean(value)}
                </span>
              ) : key.includes("routing_number") && value ? (
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {value.replace(/(\d{4})(\d{4})(\d{1})/, "$1-$2-$3")}
                </span>
              ) : key.includes("account_number") && value ? (
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  ****{value.slice(-4)}
                </span>
              ) : (
                <span>{value || "Not provided"}</span>
              )}
            </div>
          </div>
        );
      });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getFormTitle(formType)}
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted on {formatDate(formData.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Print Form"
              >
               Print
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Form Completed
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Form Details
            </h4>
            <div className="bg-white rounded-lg p-4">{renderFormFields()}</div>
          </div>

          {/* Signature Section */}
          {(formData.electronic_signature || formData.employee_signature) && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Electronic Signature
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Signed by:</span>
                  <span className="font-medium text-gray-900">
                    {formData.electronic_signature ||
                      formData.employee_signature}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date signed:</span>
                  <span className="text-gray-900">
                    {formatDate(formData.signature_date)}
                  </span>
                </div>
                {formData.witness_signature && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Witnessed by:
                      </span>
                      <span className="text-gray-900">
                        {formData.witness_signature}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Witness date:
                      </span>
                      <span className="text-gray-900">
                        {formatDate(formData.witness_date)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Implement download functionality
                console.log("Download form:", formType, formData);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDetailsModal;
