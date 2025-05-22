import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// NavItem - Navigation item component for the sidebar menu.
export default function NavItem({ item, isActive, onClick }) {
  return (
    <li>
      <Link
        to={item.path}
        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
          isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={onClick}
        // Accessibility attributes
        role="menuitem" // Indicates that this is a menu item
        aria-current={isActive ? "page" : undefined} // Indicates the current page for screen readers
      >
        {/* Icon and label for the navigation item */}
        <span className="mr-3" aria-hidden="true">
          {item.icon}
        </span>
        {/* Navigation label */}
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

// Prop types for NavItem
NavItem.propTypes = {
  item: PropTypes.shape({
    path: PropTypes.string.isRequired, // Path for the navigation item
    icon: PropTypes.node.isRequired, // Icon for the navigation item
    label: PropTypes.string.isRequired, // Label for the navigation item
  }).isRequired,
  isActive: PropTypes.bool.isRequired, // Indicates if the item is active
  onClick: PropTypes.func.isRequired, // Callback when the item is clicked
};

// Default props for NavItem
NavItem.defaultProps = {
  isActive: false,
  onClick: () => console.warn("onClick callback not provided to NavItem"),
};
