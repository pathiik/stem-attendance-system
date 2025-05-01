import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";

// Header - Navigation header component for the admin dashboard
export default function Header({ onMenuClick }) {
  const [greeting, setGreeting] = useState("Hello"); // State to store the greeting message

  useEffect(() => {
    const updatedGreeting = () => {
      try {
        const currentHour = new Date().getHours(); // Get the current hour
        if (currentHour < 12)
          setGreeting("Good Morning"); // Set greeting for morning
        else if (currentHour < 18)
          setGreeting("Good Afternoon"); // Set greeting for afternoon
        else setGreeting("Good Evening"); // Set greeting for evening}
      } catch (error) {
        console.error("Error getting greeting:", error); // Log any errors that occur while getting the greeting
        setGreeting("Hello"); // Fallback greeting in case of error
      }
    };

    updatedGreeting(); // Call the function to update the greeting
    const interval = setInterval(updatedGreeting, 3600000); // Update greeting every hour
    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  return (
    <header
      className="bg-white shadow-sm fixed top-0 right-0 left-0 md:left-64 z-10 h-16"
      aria-label="Main header"
    >
      <div className="flex items-center justify-between px-6 h-full">
        <button
          onClick={onMenuClick}
          className="text-gray-600 focus:outline-none md:hidden"
          aria-label="Toggle navigation menu"
        >
          <FiMenu size={24} />
        </button>

        <div className="flex-1 ml-6 md:ml-0">
          <h1 className="text-xl font-semibold text-gray-800">
            {greeting}, Admin!
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100 hidden md:block"
            aria-label="Notifications"
          >
            <FiBell size={20} />
          </button>
          <Link
            to="/settings"
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="User settings"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <FiUser size={16} />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

// PropTypes for Header
Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired, // Function to handle menu click
};

// Default props for Header
Header.defaultProps = {
  onMenuClick: () => {},
};
