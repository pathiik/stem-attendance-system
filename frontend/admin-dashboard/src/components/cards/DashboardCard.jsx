import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// DashboardCard - Card component for displaying dashboard information with interactive capabilities
export default function DashboardCard({
  title,
  value,
  icon,
  to,
  onClick,
  className = "",
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Handles the click event for the card
  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (to) {
        navigate(to); // Navigate to specified route
      } else if (onClick) {
        await onClick(); // Execute provided onClick function
      }
    } catch (error) {
      console.error("Error navigating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-50 active:scale-[98%] ${
        isLoading ? "opacity-70" : ""
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} card showing ${value}`}
      onKeyDown={(e) => {
        // Handle keyboard activation
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {isLoading ? (
        // Loading state skeleton
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {icon && (
              <div className="text-primary text-2xl p-2 rounded-md bg-blue-50">
                {icon}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// PropTypes for the DashboardCard
DashboardCard.propTypes = {
  title: PropTypes.string.isRequired, // Title of the card
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Value displayed in the card
  icon: PropTypes.element, // Icon to be displayed in the card
  to: PropTypes.string, // Route to navigate to when the card is clicked
  onClick: PropTypes.func, // Function to be called when the card is clicked
  className: PropTypes.string, // Additional classes for custom styling
};

// Default props for the DashboardCard
DashboardCard.defaultProps = {
  icon: null,
  to: null,
  onClick: null,
  className: "",
};
