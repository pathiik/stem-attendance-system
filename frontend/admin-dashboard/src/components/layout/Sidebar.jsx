import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Logo from "../common/Logo";
import NavItem from "../common/NavItem";
import ConfirmationModal from "../common/modals/ConfirmationModal";

// Navigation items for the sidebar
const NAV_ITEMS = [
  { path: "/", icon: <FiHome size={20} />, label: "Dashboard" },
  { path: "/students", icon: <FiUsers size={20} />, label: "Students" },
  { path: "/teachers", icon: <FiUser size={20} />, label: "Teachers" },
  { path: "/messages", icon: <FiMessageSquare size={20} />, label: "Messages" },
  { path: "/tasks", icon: <FiCheckCircle size={20} />, label: "Tasks" },
  { path: "/settings", icon: <FiSettings size={20} />, label: "Settings" },
];

// Sidebar - Navigation sidebar component for the admin dashboard
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation(); // Get the current location from React Router
  const { logout } = useAuth(); // Get the logout function from the authentication context
  const navigate = useNavigate(); // Get the navigate function from React Router
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to control the visibility of the logout modal

  // Handle click event on logout button
  const handleConfirmLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate("/auth"); // Redirect to the authentication page after logout
    } catch (error) {
      console.error("Logout failed:", error); // Log any errors that occur during logout
    } finally {
      setShowLogoutModal(false); // Close the logout modal
    }
  };

  // Show the logout confirmation modal
  const promptLogout = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  // Close the logout confirmation modal
  const cancelLogout = () => {
    setShowLogoutModal(false); // Close the logout confirmation modal
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
          aria-hidden={!isOpen}
          tabIndex={-1}
          role="button"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out h-screen`}
        aria-label="Main navigation"
      >
        {/* Logo section */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Logo
            lightMode={false}
            className="w-52 object-contain"
            fallbackText="STEM Canada Logo"
          />
        </div>

        {/* Navigation links */}
        <nav className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors"
            onClick={promptLogout}
            aria-label="Logout"
          >
            <FiLogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={cancelLogout}
        confirmText="Logout"
        cancelText="Cancel"
        destructive={true}
        isOpen={showLogoutModal}
      />
    </>
  );
}

// Prop types for Sidebar
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Indicates if the sidebar is open
  onClose: PropTypes.func.isRequired, // Callback function to close the sidebar
};

// Default props for Sidebar
Sidebar.defaultProps = {
  isOpen: false,
  onClose: () => console.warn("onClose callback not provided to Sidebar"),
};
