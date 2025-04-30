import PropTypes from "prop-types";

// Tabs for authentication forms
const TABS = [
  { id: "login", label: "Login" },
  { id: "signup", label: "Signup" },
];

// AuthTabs - Tab navigation component for authentication forms.
export default function AuthTabs({ activeTab, onTabChange }) {
  // Handle key down events for accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onTabChange(activeTab);
    }
  };

  return (
    <div className="flex mb-8" role="tablist" aria-label="Authentication tabs">
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          id={`${tab.id}-tab`}
          role="tab"
          tabIndex={activeTab === tab.id ? 0 : -1}
          className={`flex-1 py-3 px-4 transition-colors duration-200 ${
            index === 0 ? "rounded-l-lg" : "rounded-r-lg"
          } font-medium ${
            activeTab === tab.id
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onTabChange(tab.id)}
          // Accessibility attributes
          aria-selected={activeTab === tab.id} // Indicates if the tab is selected
          aria-controls={`${tab.id}-tabpanel`} // Controls the associated tab panel
          onKeyDown={(e) => handleKeyDown(e, tab.id)} // Handle key down events
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Prop types for AuthTabs
AuthTabs.propTypes = {
  activeTab: PropTypes.oneOf(["login", "signup"]).isRequired, // Currently active tab
  onTabChange: PropTypes.func.isRequired, // Callback when tab is changed
};

// Default props for AuthTabs
AuthTabs.defaultProps = {
  activeTab: "login",
  onTabChange: () =>
    console.warn("onTabChange callback not provided to AuthTabs"),
};
