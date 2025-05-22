import { useState } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorBoundary from "../common/ErrorBoundary";

// Layout - Main layout component that wraps all admin dashboard pages
export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control the visibility of the sidebar

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle the sidebar state
  };

  // Close the sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header component */}
        <Header onMenuClick={toggleSidebar} />

        {/* Main content with error boundary */}
        <main
          className="flex-1 overflow-y-auto mt-16 md:ml-64 p-4 md:p-6"
          role="main"
        >
          <ErrorBoundary
            fallback={
              <div className="p-4 text-red-500">Content failed to load</div>
            }
          >
            {/* Render children or router outlet */}
            {children || <Outlet />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

// PropTypes for Layout component
Layout.propTypes = {
  children: PropTypes.node, // Children to render inside the layout
};

// Default props for Layout component
Layout.defaultProps = {
  children: null,
};
