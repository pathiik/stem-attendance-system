import { Component } from "react";
import PropTypes from "prop-types";

// ErrorBoundary - Catches JavaScript errors in its child component tree and displays a fallback UI
export default class ErrorBoundary extends Component {
  state = { hasError: false }; // State to track if an error has occurred

  // Updates state when an error is caught
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Error handling lifecycle method
  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    // Render fallback UI if an error has occurred, otherwise render children
    return this.state.hasError ? (
      <div className="p-4 bg-red-500 rounded">{this.props.fallback}</div>
    ) : (
      this.props.children
    );
  }
}

// PropTypes for ErrorBoundary component
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired, // Children to render if no error occurs
  fallback: PropTypes.node.isRequired, // Fallback UI to render if an error occurs
};

// Default props for ErrorBoundary component
ErrorBoundary.defaultProps = {
  fallback: (
    <div className="p-4 bg-red-500 rounded">
      <h2 className="text-lg font-semibold text-white">Error</h2>
      Something went wrong. Please refresh the page or contact support if the
      problem persists.
    </div>
  ), // Default fallback UI
};
