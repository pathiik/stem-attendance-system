import PropTypes from "prop-types";

// TabButtons - A customizable tab navigation component with accessibility support
export default function TabButtons({
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "default",
  disabled = false,
}) {
  // Validate tabs array
  if (!tabs || tabs.length === 0) {
    console.error("TabButtons: 'tabs' prop must be a non-empty array");
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Tab configuration error
      </div>
    );
  }

  // Validate activeTab exists in tabs
  if (!tabs.some((tab) => tab.id === activeTab)) {
    console.error(
      `TabButtons: activeTab '${activeTab}' not found in tabs array`
    );
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Invalid active tab
      </div>
    );
  }

  // Handles tab selection
  const handleTabChange = (tabId) => {
    if (!disabled) {
      onChange(tabId);
    }
  };

  // Returns appropriate CSS classes based on tab state and variant
  const getTabClasses = (isActive) => {
    const baseClasses =
      "flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors";

    if (disabled) {
      return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }

    if (variant === "underline") {
      return `${baseClasses} ${
        isActive
          ? "text-primary border-b-2 border-primary"
          : "text-gray-600 hover:text-gray-900"
      }`;
    }

    // Default variant
    return `${baseClasses} ${
      isActive
        ? "bg-primary text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  };

  return (
    <div
      className={`flex ${
        variant === "underline" ? "space-x-4" : "space-x-1"
      } ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={getTabClasses(activeTab === tab.id)}
          disabled={disabled}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
        >
          {/* Tab icon (if provided) */}
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {/* Tab label */}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Prop types for TabButtons
TabButtons.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier for the tab
      label: PropTypes.string.isRequired, // Display label for the tab
      icon: PropTypes.node, // Optional icon to display in the tab
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired, // Currently active tab ID
  onChange: PropTypes.func.isRequired, // Callback function to handle tab change
  className: PropTypes.string, // Additional CSS classes for custom styling
  variant: PropTypes.oneOf(["default", "underline"]), // Tab button variant
  disabled: PropTypes.bool, // Disable tab buttons if true
};

// Default props for TabButtons
TabButtons.defaultProps = {
  className: "",
  variant: "default",
  disabled: false,
};
