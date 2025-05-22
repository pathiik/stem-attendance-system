import PropTypes from "prop-types";

// CardBase - Foundation component for all card variations.
export default function CardBase({
  children,
  onClick,
  className = "",
  hoverable = true,
}) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow transition-all duration-200 ease-in-out border border-gray-100 ${
        hoverable ? "hover:shadow-md hover:-translate-y-0.5" : ""
      } ${className}`}
      onClick={onClick}
      role={onClick ? "button" : "region"}
      tabIndex={onClick ? 0 : undefined} // Make it focusable if clickable
      aria-pressed={onClick ? "false" : undefined}
      aria-label={onClick ? "Clickable card" : undefined}
      onKeyDown={(e) => {
        // Handle keyboard activation for clickable cards
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}

// Prop types for CardBase
CardBase.propTypes = {
  children: PropTypes.node.isRequired, // Card content

  // Click handler (makes card clickable)
  onClick: (props, propName) => {
    if (props[propName] && typeof props[propName] !== "function") {
      return new Error("onClick must be a function");
    }
  },
  className: PropTypes.string, // Additional CSS classes
  hoverable: PropTypes.bool, // Whether to show hover effects
};

// Default props
CardBase.defaultProps = {
  onClick: undefined,
  className: "",
  hoverable: true,
};
