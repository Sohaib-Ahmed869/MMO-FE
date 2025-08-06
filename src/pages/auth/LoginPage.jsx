import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import logo from "../../assets/MMO.png";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Shield,
  Heart,
  Users,
} from "lucide-react";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema),
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-primary-500 rounded-full blur-2xl"></div>
        </div>

        <div className="flex flex-col justify-center items-center w-full px-16 relative z-10">
          {/* Logo */}
          <img
            src={logo}
            alt="MMO Health Systems Logo"
            className="w-24 h-24 mx-auto lg:mx-0 mb-4 rounded-lg shadow-lg"
          />

          {/* Hero Content */}
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Welcome to Your
              <span className="text-primary-500 block">Healthcare Journey</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-12">
              Streamlining employee onboarding and healthcare management with
              cutting-edge technology and compassionate care.
            </p>

            {/* Feature highlights */}
            <div className="space-y-6">
              <div className="flex items-center text-white/90">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Secure & Compliant</p>
                  <p className="text-sm text-white/70">
                    HIPAA compliant platform
                  </p>
                </div>
              </div>

              <div className="flex items-center text-white/90">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Patient-Centered Care</p>
                  <p className="text-sm text-white/70">
                    Focused on health outcomes
                  </p>
                </div>
              </div>

              <div className="flex items-center text-white/90">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Team Collaboration</p>
                  <p className="text-sm text-white/70">
                    Seamless workflow integration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-secondary-25">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src={logo}
              alt="MMO Health Systems Logo"
              className="w-16 h-16 mx-auto lg:mx-0 mb-4"
            />
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-3">
              Welcome back
            </h2>
            <p className="text-secondary-600 text-lg">
              Please sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Authentication Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-semibold text-secondary-800 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 transition-colors ${
                        errors.email
                          ? "text-red-400"
                          : "text-secondary-400 group-focus-within:text-primary-500"
                      }`}
                    />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 bg-red-50/50 focus:ring-red-100"
                        : "border-secondary-200 focus:border-primary-500 bg-secondary-50/50 focus:bg-white focus:ring-primary-100"
                    } placeholder-secondary-400`}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-semibold text-secondary-800 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 transition-colors ${
                        errors.password
                          ? "text-red-400"
                          : "text-secondary-400 group-focus-within:text-primary-500"
                      }`}
                    />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 bg-red-50/50 focus:ring-red-100"
                        : "border-secondary-200 focus:border-primary-500 bg-secondary-50/50 focus:bg-white focus:ring-primary-100"
                    } placeholder-secondary-400`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-primary-500 focus:ring-primary-200 border-secondary-300 rounded cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-secondary-700">
                    Remember me for 30 days
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed text-black font-bold text-lg py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="small" />
                      <span className="ml-3">Signing you in...</span>
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </button>
              </div>
            </form>

            {/* Sign up section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-secondary-500 font-medium">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full bg-white border-2 border-secondary-200 text-secondary-700 hover:bg-secondary-50 hover:border-primary-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02]"
                >
                  Create New Employee Account
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-secondary-500">
              © 2024 MMO Health Systems. All rights reserved.
            </p>
            <p className="text-xs text-secondary-400 mt-1">
              Secure healthcare platform - HIPAA compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
