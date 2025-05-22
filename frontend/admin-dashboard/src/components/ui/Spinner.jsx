import PropTypes from "prop-types";

// Spinner - A customizable loading indicator component
export default function Spinner({
  size = "md",
  color = "text-primary",
  className = "",
}) {
  // Size classes for different spinner sizes
  const sizeClasses = {
    sm: "h-4 w-4 border-2", // Small spinner
    md: "h-8 w-8 border-4", // Medium spinner
    lg: "h-12 w-12 border-4", // Large spinner
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent ${sizeClasses[size]} ${color} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Hidden text - only for screen readers */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Prop types for the Spinner
Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]), // Size of the spinner
  color: PropTypes.string, // Color of the spinner (text color)
  className: PropTypes.string, // Additional classes for custom styling
};

// Default props for the Spinner
Spinner.defaultProps = {
  size: "md",
  color: "text-primary",
  className: "",
};
