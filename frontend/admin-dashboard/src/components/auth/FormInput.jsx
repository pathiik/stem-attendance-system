import { useCallback, useState } from "react";
import { FiMail, FiLock, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import PropTypes from "prop-types";

// Function to return the appropriate icon based on the type of input
const getIcon = (icon, isFocused) => {
  const iconClass = `${isFocused ? "text-primary" : "text-gray-400"}`; // Dynamic class for icon color

  // Return the icon based on the type prop
  switch (icon) {
    case "email":
      return <FiMail className={iconClass} />;
    case "lock":
      return <FiLock className={iconClass} />;
    default:
      return null;
  }
};

// FormInput - Input component for authentication forms
export default function FormInput({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  className = "",
  required,
  pattern,
  maxLength,
  disabled,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isFocused, setIsFocused] = useState(false); // State to track if the input is focused
  const [isValid, setIsValid] = useState(true); // State to track if the input is valid

  // Function to validate the input value
  const handleValidation = useCallback(
    (e) => {
      if (pattern) setIsValid(new RegExp(pattern).test(e.target.value));
    },
    [pattern]
  );

  // Function to handle input changes
  const handleChange = (e) => {
    onChange(e);
    if (pattern) handleValidation(e); // Validate the input if a pattern is provided
  };

  return (
    <div className={`relative mb-4 ${className}`}>
      {/* Left Icon */}
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getIcon(icon, isFocused)}
        </div>
      )}

      {/* Input Field */}
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)} // Set focused state to true on focus
        onBlur={(e) => {
          setIsFocused(false); // Set focused state to false on blur
          handleValidation(e); // Validate the input on blur
        }}
        disabled={disabled}
        className={`w-full py-3 ${icon ? "pl-10" : "pl-4"} ${
          type === "password" || value ? "pr-10" : "pr-4"
        } border ${
          error || !isValid
            ? "border-red-500 ring-2 ring-red-500/20"
            : isFocused
            ? "border-primary ring-2 ring-primary/20"
            : "border-gray-300"
        } rounded-lg focus:outline-none transition-all duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        // Accessibility attributes
        aria-invalid={!!error || !isValid} // Indicates if the input is invalid
        aria-describedby={error ? "error-message" : undefined} // Describes the error message
        aria-required={required ? "true" : "false"} // Indicates if the input is required
        {...props} // Spread any additional props
      />

      {/* Right Buttons */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
        {/* Password visibilty toggle */}
        {type === "password" && (
          <button
            type="button"
            className="flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility label for the button
          >
            {showPassword ? (
              <FiEyeOff className="text-gray-500 hover:text-primary" />
            ) : (
              <FiEye className="text-gray-500 hover:text-primary" />
            )}
          </button>
        )}

        {/* Clear button (for non-password fields) */}
        {type !== "password" && value && (
          <button
            type="button"
            className="flex items-center"
            onClick={() => onChange({ target: { value: "" } })}
            disabled={disabled}
            aria-label="Clear input" // Accessibility label for the button
          >
            <FiX className="text-gray-500 hover:text-primary" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id="error-message"
          className="mt-1 text-sm text-red-600"
          role="alert" // Role for accessibility
        >
          {error}
        </p>
      )}

      {/* Character counter */}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

// Prop types for FormInput
FormInput.propTypes = {
  type: PropTypes.string, // Type of the input field (text, email, password, etc.)
  placeholder: PropTypes.string.isRequired, // Placeholder text for the input field
  value: PropTypes.string.isRequired, // Value of the input field
  onChange: PropTypes.func.isRequired, // Function to handle input changes
  icon: PropTypes.oneOf(["email", "lock"]), // Icon type for the input field (email or lock)
  error: PropTypes.string, // Error message to display
  className: PropTypes.string, // Additional CSS classes for the input field
  required: PropTypes.bool, // Whether the input is required
  pattern: PropTypes.string, // Regex pattern for validation
  maxLength: PropTypes.number, // Maximum length of the input value
  disabled: PropTypes.bool, // Whether the input is disabled
};

// Default props for FormInput
FormInput.defaultProps = {
  type: "text",
  icon: null,
  error: null,
  className: "",
  required: false,
  pattern: null,
  maxLength: null,
  disabled: false,
};
