import PropTypes from "prop-types";

// Color configuration mapping for different status types
const statusColorConfig = {
  Present: {
    bg: "bg-green-50 hover:bg-green-100",
    text: "text-green-700",
    border: "border border-green-200 hover:border-green-300",
  },
  Absent: {
    bg: "bg-red-50 hover:bg-red-100",
    text: "text-red-700",
    border: "border border-red-200 hover:border-red-300",
  },
  Unread: {
    bg: "bg-blue-50 hover:bg-blue-100",
    text: "text-blue-700",
    border: "border border-blue-100 hover:border-blue-200",
  },
  Read: {
    bg: "bg-green-50 hover:bg-green-100",
    text: "text-green-700",
    border: "border border-green-100 hover:border-green-200",
  },
  Default: {
    bg: "bg-gray-50 hover:bg-gray-100",
    text: "text-gray-700",
    border: "border border-gray-100 hover:border-gray-200",
  },
};

// StatusBadge - A reusable badge component for displaying status with customizable options.
export default function StatusBadge({
  status,
  className = "",
  showIcon = false,
  customIcon = null,
}) {
  // Validate status prop with fallback UI
  if (!status) {
    console.error("StatusBadge: Missing required 'status' prop");
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 ${className}`}
        aria-label="Missing status"
      >
        Unknown
      </span>
    );
  }

  // Get color configuration for the status
  const config = statusColorConfig[status] || statusColorConfig.Default;
  const { bg, text, border } = config;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${border} transition-colors duration-150 ${className}`}
      aria-label={`Status: ${status}`}
      title={`Status: ${status}`}
    >
      {showIcon && customIcon && (
        <span className="mr-1" aria-hidden="true">
          {customIcon}
        </span>
      )}
      {status}
    </span>
  );
}

// Prop types for StatusBadge
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired, // Status type (e.g., Present, Absent, Unread, Read)
  className: PropTypes.string, // Additional CSS classes for customization
  showIcon: PropTypes.bool, // Whether to show an icon next to the status
  customIcon: PropTypes.node, // Custom icon to display next to the status
};

// Default props for StatusBadge
StatusBadge.defaultProps = {
  className: "",
  showIcon: false,
  customIcon: null,
};
