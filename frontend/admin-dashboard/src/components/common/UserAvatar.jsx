import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiUser } from "react-icons/fi";

// UserAvatar - A reusable avatar component that displays a user's avatar image with fallback options
export default function UserAvatar({
  src,
  alt = "User avatar",
  className = "",
  icon = <FiUser />,
  size = "md",
  bgColor = "bg-gray-100",
  initials = null,
  onError = null,
}) {
  const [imageError, setImageError] = useState(false); // State to track image loading error
  const [imageLoading, setImageLoading] = useState(!!src); // State to track image loading status

  // Size configuration for different avatar sizes
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      icon: 16,
      text: "text-xs",
    },
    md: {
      container: "w-10 h-10",
      icon: 20,
      text: "text-sm",
    },
    lg: {
      container: "w-12 h-12",
      icon: 24,
      text: "text-base",
    },
  };

  // Handles image loading error
  const handleImageError = (e) => {
    setImageError(true);
    setImageLoading(false);
    if (onError) {
      try {
        onError(e);
      } catch (error) {
        console.error("Avatar onError callback failed:", error);
      }
    }
  };

  // Handles successful image load
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <div
      className={`${sizeConfig[size].container} ${bgColor} rounded-full flex items-center justify-center overflow-hidden ${className}`}
      aria-label={alt}
      role="img"
    >
      {/* Image avatar - only shown if src is provided and no error */}
      {src && !imageError && (
        <>
          {/* Loading skeleton shown while image is loading */}
          {imageLoading && (
            <div
              className={`${sizeConfig[size].container} animate-pulse ${bgColor} absolute`}
            />
          )}
          {/* Actual Image */}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      )}

      {/* Fallback content shown when no image or error occured */}
      {(!src || imageError) && (
        <div className="flex items-center justify-center text-gray-600">
          {initials ? (
            <span className={`${sizeConfig[size].text} font-medium`}>
              {initials}
            </span>
          ) : (
            React.cloneElement(icon, { size: sizeConfig[size].icon })
          )}
        </div>
      )}
    </div>
  );
}

// Prop types for UserAvatar
UserAvatar.propTypes = {
  src: PropTypes.string, // Image source URL
  alt: PropTypes.string, // Alternative text for the image
  className: PropTypes.string, // Additional CSS classes for customization
  icon: PropTypes.node, // Fallback icon to display when image is not available
  size: PropTypes.oneOf(["sm", "md", "lg"]), // Size of the avatar (small, medium, large)
  bgColor: PropTypes.string, // Background color of the avatar container
  initials: PropTypes.string, // Initials to display when image is not available
  onError: PropTypes.func, // Function to handle image loading error
};

// Default props for UserAvatar
UserAvatar.defaultProps = {
  src: null,
  alt: "User avatar",
  className: "",
  icon: <FiUser />,
  size: "md",
  bgColor: "bg-gray-100",
  initials: null,
  onError: null,
};
