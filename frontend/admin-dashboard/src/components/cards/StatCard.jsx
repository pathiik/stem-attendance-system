import PropTypes from "prop-types";

// StatCard - Displays a statistic with title, value, and optional icon
export default function StatCard({ title, value, icon, className = "" }) {
  // Validate required props
  if (!title) {
    console.error("StatCard: Missing required 'title' prop");
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-red-500">
        Error: Missing title
      </div>
    );
  }

  if (value === undefined || value === null) {
    console.error("StatCard: Missing required 'value' prop");
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-red-500">
        Error: Missing value
      </div>
    );
  }

  // Formats the value for display
  const formatValue = (val) => {
    if (typeof val === "number") {
      return val.toLocaleString(); // Format numbers with commas
    }
    return val;
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100 ${className}`}
      aria-label={`Statistic: ${title} - ${value}`}
    >
      {/* Card title with truncation and tooltip */}
      <h3
        className="text-gray-500 text-sm font-medium mb-1 truncate"
        title={title}
      >
        {title}
      </h3>

      {/* Value and icon container */}
      <div className="flex justify-between items-end">
        {/* Formatted value with error fallback */}
        <p
          className="text-3xl font-bold text-gray-800 truncate"
          title={String(value)}
        >
          {formatValue(value)}
        </p>

        {/* Optional icon with hover effect */}
        {icon && (
          <div className="text-primary text-2xl p-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Prop types for StatCard
StatCard.propTypes = {
  title: PropTypes.string.isRequired, // Card title text
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Statistic value (string or number)
  icon: PropTypes.node, // Optional icon element
  className: PropTypes.string, // Additional CSS classes
};

// Default props
StatCard.defaultProps = {
  icon: null,
  className: "",
};
