import PropTypes from "prop-types";
import Logo from "../common/Logo";

// BrandingPanel - Displays the branding information on the authentication page (only on desktop)
const BrandingPanel = ({
  title = "Attendance System",
  subtitle = "Admin Dashboard",
}) => {
  return (
    <div
      className="hidden md:flex w-full md:w-1/2 bg-gradient-to-b from-primary to-blue-600 items-center justify-center p-12"
      aria-hidden="true" // Hide from screen readers as this is decorative content
    >
      <div className="text-center text-white">
        {/* Brand logo with light mode styling */}
        <Logo lightMode={true} className="w-62 mx-auto mb-6" />

        {/* Title & Subtitle */}
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <h2 className="text-xl opacity-90">{subtitle}</h2>
      </div>
    </div>
  );
};

// MobileLogo - Displays the logo on mobile devices (hidden on desktop)
const MobileLogo = () => {
  return (
    <div className="md:hidden flex justify-center mb-8">
      {/* Brand logo with dark mode styling */}
      <Logo lightMode={false} className="h-16" />
    </div>
  );
};

// AuthContainer - Wrapper container for authentication page (Login/Signup)
export default function AuthContainer({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding panel (desktop only) */}
      <BrandingPanel title={title} subtitle={subtitle} />

      {/* Right side - Form content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <MobileLogo />

          {/* Authentication form content passed as children */}
          {children}
        </div>
      </div>
    </div>
  );
}

// Prop types for AuthContainer
AuthContainer.propTypes = {
  children: PropTypes.node.isRequired, // Children elements (authentication form)
  title: PropTypes.string, // Title for the branding panel
  subtitle: PropTypes.string, // Subtitle for the branding panel
};

// Default props for AuthContainer
AuthContainer.defaultProps = {
  title: "Attendance System",
  subtitle: "Admin Dashboard",
};
