import { useState } from "react";
import PropTypes from "prop-types";

const LOGO_PATHS = {
  light: "/assets/stem-logo-light.png",
  dark: "/assets/stem-logo-dark.png",
};

export default function Logo({
  lightMode = false,
  className = "",
  onError,
  fallbackText = "Logo",
}) {
  const [logoError, setLogoError] = useState(false); // State to track logo loading error
  const [isLoading, setIsLoading] = useState(true); // State to track logo loading status

  // Function to handle logo error
  const handleImageError = () => {
    setIsLoading(false);
    setLogoError(true);
    if (onError) {
      try {
        onError();
      } catch (error) {
        console.error("Logo error handler failed!", error);
      }
    }
  };

  // Fallback UI if logo error occurs
  if (logoError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 rounded text-gray-600`}
        aria-label="Logo placeholder"
      >
        {<span className="text-sm">{fallbackText}</span>}
      </div>
    );
  }

  return (
    <div>
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className={`${className} animate-pulse bg-gray-200 rounded`}
          aria-hidden="true"
        />
      )}

      {/* Logo Image */}
      <img
        loading="lazy"
        src={lightMode ? LOGO_PATHS.light : LOGO_PATHS.dark}
        alt="STEM Canada Logo"
        className={`${className} ${
          isLoading ? "opacity-0 absolute" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        aria-hidden={isLoading}
      />
    </div>
  );
}

// Prop Types for Logo
Logo.propTypes = {
  lightMode: PropTypes.bool, // Whether to use light mode logo
  className: PropTypes.string, // Additional CSS classes for the logo
  onError: PropTypes.func, // Function to handle logo loading error
  fallbackText: PropTypes.string, // Fallback text if logo fails to load
};

Logo.defaultProps = {
  lightMode: false,
  className: "",
  onError: null,
  fallbackText: "Logo",
};
