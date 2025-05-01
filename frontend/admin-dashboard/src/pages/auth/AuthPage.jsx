import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthTabs from "../../components/auth/AuthTabs";
import FormInput from "../../components/auth/FormInput";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login"); // State for active tab (login/signup)
  // State for form data (email, password, confirm password)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Only used for signup
  });
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading status

  const { login, signup, getUserFriendlyError } = useAuth(); // Auth context methods
  const navigate = useNavigate(); // Hook for navigation

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [error]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value })); // Update form data state
  };

  // Function to handle form validation
  const validateForm = useCallback(() => {
    // Check if email has "@" symbol
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Check if password is less than 8 characters
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    // Check if password and confirm password match (only for signup)
    if (
      activeTab === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  }, [formData, activeTab]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent default form submission
      setLoading(true);
      setError("");

      try {
        if (!validateForm()) return; // Validate form before submission

        if (activeTab === "signup") {
          await signup(formData.email, formData.password); // Call signup method
          navigate("/"); // Navigate to home page after signup
        } else {
          await login(formData.email, formData.password); // Call login method
          navigate("/"); // Navigate to home page after login
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

      <AuthTabs activeTab={activeTab} onTabChange={switchTab} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          icon="email"
          required
          autoComplete="email"
        />

        <FormInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          icon="lock"
          required
          minLength={6}
          autoComplete={
            activeTab === "login" ? "current-password" : "new-password"
          }
        />

        {activeTab === "login" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => alert("Password reset functionality coming soon!")}
              className="text-primary hover:underline text-sm focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
        )}

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
            minLength={6}
            autoComplete="new-password"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Processing..."
            : activeTab === "login"
            ? "Login"
            : "Sign Up"}
        </button>

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
