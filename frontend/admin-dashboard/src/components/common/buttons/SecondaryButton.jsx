import PropTypes from "prop-types";

// SecondaryButton - A styled button component for secondary actions
export default function SecondaryButton({
  children,
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 
        bg-white text-gray-800 rounded-lg 
        font-medium
        border border-gray-300
        transition-all duration-200
        shadow-sm
        hover:bg-gray-50
        hover:border-gray-400
        hover:shadow-md
        active:bg-gray-100
        active:shadow-xs
        focus:outline-none
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
      aria-disabled={disabled} // Accessibility: Indicates if the button is disabled
    >
      {children}
    </button>
  );
}

// Prop types for SecondaryButton
SecondaryButton.propTypes = {
  children: PropTypes.node.isRequired, // Button content
  onClick: PropTypes.func.isRequired, // Click event handler
  className: PropTypes.string, // Additional CSS classes
  disabled: PropTypes.bool, // Disabled state
};

// Default props for SecondaryButton
SecondaryButton.defaultProps = {
  className: "",
  disabled: false,
};
