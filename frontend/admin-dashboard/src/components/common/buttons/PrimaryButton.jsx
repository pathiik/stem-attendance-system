import PropTypes from "prop-types";

export default function PrimaryButton({
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
        bg-primary text-white rounded-lg 
        font-medium
        border border-primary
        hover:text-primary
        transition-all duration-300
        shadow-md
        hover:bg-primary/10
        hover:shadow-lg
        active:bg-primary/20
        active:shadow-sm
        focus:outline-none
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Prop types for PrimaryButton
PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired, // Button content
  onClick: PropTypes.func.isRequired, // Click event handler
  className: PropTypes.string, // Additional CSS classes
  disabled: PropTypes.bool, // Disabled state
};

// Default props for PrimaryButton
PrimaryButton.defaultProps = {
  className: "",
  disabled: false,
};
