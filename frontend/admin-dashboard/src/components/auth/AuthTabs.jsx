import PropTypes from "prop-types";

// Tabs for authentication forms
const TABS = [
  { id: "login", label: "Login" },
  { id: "signup", label: "Signup" },
];

// AuthTabs - Tab navigation component for switching between authentication forms (Login/Signup)
export default function AuthTabs({ activeTab, onTabChange }) {
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e, tabId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent scroll on spacebar
      onTabChange(tabId);
    }
  };

  return (
    <div className="flex mb-8" role="tablist" aria-label="Authentication tabs">
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          id={`${tab.id}-tab`}
          role="tab"
          tabIndex={activeTab === tab.id ? 0 : -1} // Only the active tab is focusable
          className={`flex-1 py-3 px-4 transition-colors duration-200 ${
            index === 0 ? "rounded-l-lg" : "rounded-r-lg"
          } font-medium ${
            activeTab === tab.id
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onTabChange(tab.id)}
          aria-selected={activeTab === tab.id} // Indicates selected state to screen readers
          aria-controls={`${tab.id}-tabpanel`} // Associate with the corresponding tabpanel
          onKeyDown={(e) => handleKeyDown(e, tab.id)} // Keyboard navigation support
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
  onTabChange: PropTypes.func.isRequired, // Callback function when tab is changed
};

// Default props for AuthTabs
AuthTabs.defaultProps = {
  activeTab: "login",
  onTabChange: () =>
    console.warn("onTabChange callback not provided to AuthTabs"),
};
