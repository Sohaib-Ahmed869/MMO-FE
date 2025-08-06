import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onboardingAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  FileText,
  Shield,
  CreditCard,
  Heart,
  Syringe,
  HardHat,
  Briefcase,
  User,
  Book,
  Stethoscope,
} from "lucide-react";

const OnboardingDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressResponse, formsResponse] = await Promise.all([
          onboardingAPI.getProgress(),
          onboardingAPI.getForms(),
        ]);

        setProgress(progressResponse.progress);
        setForms(formsResponse.forms);
      } catch (err) {
        setError("Failed to load onboarding data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onboardingSteps = [
    {
      id: "compliance-statement",
      title: "Compliance Statement",
      description: "Complete background checks and screening requirements",
      icon: Shield,
      route: "/onboarding/compliance-statement",
      category: "Essential",
      formKey: "compliance_statements",
      progressKey: "compliance_statement_completed",
    },
    {
      id: "confidentiality-agreement",
      title: "Confidentiality Agreement",
      description: "Sign confidentiality and non-disclosure agreements",
      icon: FileText,
      route: "/onboarding/confidentiality-agreement",
      category: "Essential",
      formKey: "confidentiality_agreements",
      progressKey: "confidentiality_agreement_completed",
    },
    {
      id: "job-acceptance",
      title: "Job Acceptance Form",
      description: "Formally accept your position and terms",
      icon: Briefcase,
      route: "/onboarding/job-acceptance",
      category: "Essential",
      formKey: "job_acceptance_forms",
      progressKey: "job_acceptance_completed",
    },
    {
      id: "job-description",
      title: "Job Description Acknowledgment",
      description: "Review and acknowledge your job responsibilities",
      icon: User,
      route: "/onboarding/job-description",
      category: "Essential",
      formKey: "job_description_acknowledgments",
      progressKey: "job_description_completed",
    },
    {
      id: "direct-deposit",
      title: "Direct Deposit Authorization",
      description: "Set up direct deposit for your salary",
      icon: CreditCard,
      route: "/onboarding/direct-deposit",
      category: "Financial",
      formKey: "direct_deposit_authorizations",
      progressKey: "direct_deposit_completed",
    },
    {
      id: "health-statement",
      title: "Health Statement",
      description: "Complete health information and emergency contacts",
      icon: Heart,
      route: "/onboarding/health-statement",
      category: "Health",
      formKey: "health_statements",
      progressKey: "health_statement_completed",
    },
    {
      id: "hepatitis-b",
      title: "Hepatitis B Vaccination",
      description: "Complete vaccination requirements",
      icon: Syringe,
      route: "/onboarding/hepatitis-b",
      category: "Health",
      formKey: "hepatitis_b_vaccinations",
      progressKey: "hepatitis_b_completed",
    },
    {
      id: "tb-questionnaire",
      title: "TB Medical Questionnaire",
      description: "Complete tuberculosis screening questionnaire",
      icon: Stethoscope,
      route: "/onboarding/tb-questionnaire",
      category: "Health",
      formKey: "tb_medical_questionnaires",
      progressKey: "tb_questionnaire_completed",
    },
    {
      id: "influenza-declination",
      title: "Influenza Vaccination Declination",
      description: "Flu vaccination requirements and declination",
      icon: Syringe,
      route: "/onboarding/influenza-declination",
      category: "Health",
      formKey: "influenza_vaccination_declinations",
      progressKey: "influenza_declination_completed",
    },
    {
      id: "ppe-acknowledgement",
      title: "PPE Acknowledgement",
      description: "Personal protective equipment training and acknowledgment",
      icon: HardHat,
      route: "/onboarding/ppe-acknowledgement",
      category: "Safety",
      formKey: "ppe_acknowledgements",
      progressKey: "ppe_acknowledgement_completed",
    },
    {
      id: "field-practice",
      title: "Field Practice Statement",
      description: "Field work guidelines and safety protocols",
      icon: HardHat,
      route: "/onboarding/field-practice",
      category: "Safety",
      formKey: "field_practice_statements",
      progressKey: "field_practice_completed",
    },
    {
      id: "policies-procedures",
      title: "Policies & Procedures",
      description: "Company policies and procedures acknowledgment",
      icon: Book,
      route: "/onboarding/policies-procedures",
      category: "Documentation",
      formKey: "policies_procedures_statements",
      progressKey: "policies_procedures_completed",
    },
    {
      id: "handbook-acknowledgment",
      title: "Employee Handbook",
      description: "Employee handbook receipt and acknowledgment",
      icon: Book,
      route: "/onboarding/handbook-acknowledgment",
      category: "Documentation",
      formKey: "employee_handbook_acknowledgments",
      progressKey: "handbook_acknowledgment_completed",
    },
  ];

  const getStepStatus = (step) => {
    if (progress?.[step.progressKey]) {
      return "completed";
    }
    if (forms?.[step.formKey]?.length > 0) {
      return "completed";
    }
    return "pending";
  };

  const getProgressStats = () => {
    const total = onboardingSteps.length;
    const completed = onboardingSteps.filter(
      (step) => getStepStatus(step) === "completed"
    ).length;
    const percentage = Math.round((completed / total) * 100);

    return { total, completed, percentage };
  };

  const { total, completed, percentage } = getProgressStats();

  const groupedSteps = onboardingSteps.reduce((acc, step) => {
    if (!acc[step.category]) {
      acc[step.category] = [];
    }
    acc[step.category].push(step);
    return acc;
  }, {});

  const categoryColors = {
    Essential: "bg-red-500",
    Financial: "bg-green-500",
    Health: "bg-blue-500",
    Safety: "bg-orange-500",
    Documentation: "bg-purple-500",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Onboarding
            </h1>
            <p className="text-gray-600 mt-1">
              Complete all required forms to finish your onboarding process
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              {percentage}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>
              {completed} of {total} forms completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary-600 h-4 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {total - completed}
            </div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{total}</div>
            <div className="text-sm text-gray-500">Total Forms</div>
          </div>
        </div>

        {percentage === 100 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">
                  Congratulations! 🎉
                </h3>
                <p className="text-green-700 mt-1">
                  You have successfully completed all onboarding requirements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Onboarding Steps by Category */}
      {Object.entries(groupedSteps).map(([category, steps]) => (
        <div
          key={category}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-6">
            <div
              className={`w-3 h-3 ${categoryColors[category]} rounded-full mr-3`}
            />
            <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
            <span className="ml-3 text-sm text-gray-500">
              (
              {
                steps.filter((step) => getStepStatus(step) === "completed")
                  .length
              }
              /{steps.length} completed)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const status = getStepStatus(step);

              return (
                <Link
                  key={step.id}
                  to={step.route}
                  className={`group relative bg-white border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
                    status === "completed"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  {/* Status Icon */}
                  <div className="absolute top-4 right-4">
                    {status === "completed" ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Form Icon */}
                  <div className="mb-4">
                    <div
                      className={`inline-flex p-3 rounded-lg ${
                        status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600"
                      } transition-colors`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pr-8">
                    <h3
                      className={`text-lg font-medium mb-2 ${
                        status === "completed"
                          ? "text-green-800"
                          : "text-gray-900 group-hover:text-primary-600"
                      } transition-colors`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {step.description}
                    </p>

                    {/* Action */}
                    <div className="flex items-center text-sm font-medium">
                      {status === "completed" ? (
                        <span className="text-green-600">Completed</span>
                      ) : (
                        <>
                          <span className="text-primary-600 group-hover:text-primary-700">
                            Start Form
                          </span>
                          <ArrowRight className="w-4 h-4 ml-1 text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-3">
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            All forms must be completed within your first 30 days of employment.
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            Some forms may require additional documentation or signatures.
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            You can save your progress and return to complete forms later.
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            Contact HR if you encounter any technical issues or have questions.
          </li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Circle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingDashboard;
