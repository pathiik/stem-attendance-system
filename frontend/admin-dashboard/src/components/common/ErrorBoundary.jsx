import { Component } from "react";
import PropTypes from "prop-types";

export default class ErrorBoundary extends Component {
  state = { hasError: false }; // Initialize state to track if an error has occurred

  static getDerivedStateFromError() {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    // Render fallback UI if an error has occurred, otherwise render children
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// PropTypes for ErrorBoundary component
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired, // Children to render if no error occurs
  fallback: PropTypes.node.isRequired, // Fallback UI to render if an error occurs
};

// Default props for ErrorBoundary component
ErrorBoundary.defaultProps = {
  fallback: <div>Something went wrong.</div>, // Default fallback UI
};
