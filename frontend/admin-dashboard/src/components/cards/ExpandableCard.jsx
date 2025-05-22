import { Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";

import { FiChevronRight } from "react-icons/fi";
import { MdOutlineBadge } from "react-icons/md";

import Spinner from "../ui/Spinner";
import StatusBadge from "../common/StatusBadge";
import UserAvatar from "../common/UserAvatar";

// NavigationChevron - Reusable chevron icon for navigation indication
function NavigationChevron({ className = "" }) {
  return (
    <FiChevronRight
      className={`text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition-colors ${className}`}
      aria-hidden="true"
    />
  );
}

// StudentIdBadge - Displays student ID with badge icon
function StudentIdBadge({ studentId, className = "" }) {
  return (
    <div
      className={`flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100 ${className}`}
    >
      <MdOutlineBadge
        className="mr-1.5 flex-shrink-0 text-gray-500"
        size={14}
      />
      <span className="truncate max-w-20">ID: {studentId}</span>
    </div>
  );
}

// ErrorCard - Displays error messages in a user-friendly way
function ErrorCard({ message }) {
  return (
    <div className="w-full p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1">Please try again or contact support</p>
    </div>
  );
}

// ExpandableCard - Interactive card component for displaying user information
export default function ExpandableCard({ item, type }) {
  const [isNavigating, setIsNavigating] = useState(false); // State to manage navigation status
  const [error, setError] = useState(null); // State to manage error messages

  // Validate input props
  if (!item) {
    console.error("ExpandableCard: No item prop provided");
    return <ErrorCard message="No user data provided" />;
  }

  // Destructure with fallbacks and validation
  const {
    id = "",
    studentId = "",
    name = "Unknown User",
    email = "",
    status = null,
    avatar = null,
  } = item;

  if (!id) {
    console.error("ExpandableCard: Missing required id in item prop");
    return <ErrorCard message="Invalid user data: missing ID" />;
  }

  // Manages card click/navigation with error handling
  const handleNavigation = async (e) => {
    try {
      if (isNavigating) {
        e.preventDefault();
        return;
      }

      if (!type || !id) {
        throw new Error("Missing required navigation parameters");
      }

      setIsNavigating(true);
      setError(null);
    } catch (err) {
      console.error("Navigation failed:", err);
      setError(err.message || "Failed to navigate");
      setIsNavigating(false);
      e.preventDefault();
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 relative group">
      <Link
        to={`/${type}/${id}`}
        onClick={handleNavigation}
        aria-label={`View ${
          type === "students" ? "student" : "teacher"
        } details: ${name}`}
        className={`flex flex-col p-4 bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 ease-in-out border border-gray-100 h-full ${
          isNavigating ? "opacity-70 cursor-wait" : "hover:shadow-lg"
        }`}
      >
        {/* Loading overlay */}
        {isNavigating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg z-10">
            <Spinner size="sm" className="text-primary" />
          </div>
        )}

        {/* Error message overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 rounded-lg p-2 z-10">
            <span className="text-red-600 text-sm text-center font-medium">
              {error}
            </span>
          </div>
        )}

        {/* Profile header section */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 min-w-0">
            <UserAvatar
              src={avatar}
              alt={`${name}'s avatar`}
              size="md"
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{name}</h3>
              {email && (
                <p className="text-sm text-gray-500 truncate">{email}</p>
              )}
            </div>
          </div>
          <NavigationChevron />
        </div>

        {/* Combined ID and Status section (students only) */}
        {type === "students" && (
          <div className="flex justify-between items-center mt-auto pt-2 space-x-2">
            {studentId ? (
              <StudentIdBadge studentId={studentId} />
            ) : (
              <span className="text-xs text-gray-400 italic">
                No ID available
              </span>
            )}
            {status && <StatusBadge status={status} />}
          </div>
        )}
      </Link>
    </div>
  );
}

// Prop types for ExpandableCard
ExpandableCard.propTypes = {
  // Item prop object containing user data
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    studentId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.oneOf(["Present", "Absent", null]),
    avatar: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(["students", "teachers"]).isRequired,
};

// Default props for ExpandableCard
ExpandableCard.defaultProps = {
  item: {
    name: "",
    email: "",
    status: null,
    studentId: "",
    avatar: null,
  },
};
