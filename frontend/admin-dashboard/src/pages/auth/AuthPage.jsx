import { useEffect, useState, useCallback } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import AuthContainer from "../../components/auth/AuthContainer";
import AuthTabs from "../../components/auth/AuthTabs";
import FormInput from "../../components/auth/FormInput";

// AuthPage - Main authentication page component handling both login and signup
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login"); // State for active tab (login/signup)

  // State for form data (email, password, confirm password)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Only used for signup
  });

  // States for error messages and loading status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup, getUserFriendlyError } = useAuth(); // Auth context methods
  const navigate = useNavigate(); // Hook for navigation

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [error]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value })); // Update form data state
    if (error) setError(""); // Clear error when user starts typing
  };

  // Form validation logic
  const validateForm = useCallback(() => {
    // Email validation (simple check for '@' symbol)
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Password validation (length check)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    // Password confirmation validation (only for signup)
    if (
      activeTab === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  }, [formData, activeTab]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent default form submission
      setLoading(true);
      setError("");

      try {
        // Validate form before submission
        if (!validateForm()) {
          setLoading(false);
          return;
        }

        // Execute appropriate auth action based on active tab
        if (activeTab === "signup") {
          await signup(formData.email, formData.password);
          navigate("/", { replace: true }); // Replace history entry after signup
        } else {
          await login(formData.email, formData.password); // Call login method
          navigate("/", { replace: true }); // Replace history entry after login
        }
      } catch (error) {
        setError(getUserFriendlyError(error)); // Set error message from auth context
      } finally {
        setLoading(false);
      }
    },
    [
      activeTab,
      formData,
      validateForm,
      login,
      signup,
      navigate,
      getUserFriendlyError,
    ]
  );

  // Handle tab switch
  const switchTab = (tab) => {
    setActiveTab(tab); // Switch between login and signup tabs
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <AuthContainer title="Attendance System" subtitle="Admin Dashboard">
      {/* Header section with dynamic content based on active tab */}
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeTab === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>
        <p className="text-gray-600 mt-2">
          {activeTab === "login"
            ? "Sign in to access your account"
            : "Get started with your account"}
        </p>
      </div>

      {/* Tab Navigation component */}
      <AuthTabs activeTab={activeTab} onTabChange={switchTab} />

      {/* Error message display */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
          role="alert" // Accessibility role for alert
        >
          {error}
        </div>
      )}

      {/* Main form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email input field */}
        <FormInput
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          icon="email"
          required
          autoComplete="email"
        />

        {/* Password input field */}
        <FormInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          icon="lock"
          required
          minLength={8}
          autoComplete={
            activeTab === "login" ? "current-password" : "new-password"
          }
          aria-label="Password"
        />

        {/* Forgot password link (login only) */}
        {activeTab === "login" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => alert("Password reset functionality coming soon!")} // Placeholder for password reset functionality
              className="text-primary hover:underline text-sm focus:outline-none"
              aria-label="Forgot Password" // Accessibility label for button
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Confirm password field (signup only) */}
        {activeTab === "signup" && (
          <FormInput
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            icon="lock"
            required
            minLength={8}
            autoComplete="new-password"
            aria-label="Confirm Password" // Accessibility label for input
          />
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          aria-busy={loading} // Accessibility attribute indicating loading state
        >
          {loading
            ? "Processing..."
            : activeTab === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        {/* Switch between login and signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </AuthContainer>
  );
}
