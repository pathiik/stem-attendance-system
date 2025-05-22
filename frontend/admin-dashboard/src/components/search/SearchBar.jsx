import PropTypes from "prop-types";
import { FiSearch } from "react-icons/fi";

// SearchBar - A reusable search input component
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  // Handles input change events
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <FiSearch className="text-gray-400" />
      </div>

      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          pl-10 pr-4 py-2 w-full 
          border border-gray-300 rounded-lg
          bg-white text-gray-800
          focus:outline-none focus:border-gray-400
        "
      />
    </div>
  );
}

// Prop types for SearchBar
SearchBar.propTypes = {
  value: PropTypes.string.isRequired, // Current value of the input
  onChange: PropTypes.func.isRequired, // Function to handle input changes
  placeholder: PropTypes.string, // Placeholder text for the input
  className: PropTypes.string, // Additional class names for styling
};

// Default props for SearchBar
SearchBar.defaultProps = {
  placeholder: "Search...",
  className: "",
};
