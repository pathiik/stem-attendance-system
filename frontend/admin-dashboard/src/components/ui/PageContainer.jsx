import PropTypes from "prop-types";

// PageContainer - A standardized container for page content with title and optional action button
export default function PageContainer({
  title,
  children,
  actionButton,
  isLoading = false,
  error = null,
  className = "",
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header section with title and action button */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

        {/* Action button area - only renders if actionButton exists */}
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
      </header>

      {/* Main content area */}
      <main>
        {/* Loading state overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Page content container */}
        <div
          className={`bg-white p-6 rounded-lg shadow ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

// Prop types for PageContainer
PageContainer.propTypes = {
  title: PropTypes.string.isRequired, // Page title text
  children: PropTypes.node.isRequired, // Main content of the page
  actionButton: PropTypes.node, // Optional action button component
  isLoading: PropTypes.bool, // Loading state indicator
  error: PropTypes.string, // Error message to display
  className: PropTypes.string, // Additional CSS classes for the container
};

// Default props for PageContainer
PageContainer.defaultProps = {
  isLoading: false,
  className: "",
};
