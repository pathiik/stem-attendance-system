import { useState } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorBoundary from "../common/ErrorBoundary";

// Outlet - Main layout component for the admin dashboard
export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control the visibility of the sidebar

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Close the sidebar
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleSidebar} />

        <main
          className="flex-1 overflow-y-auto mt-16 md:ml-64 p-4 md:p-6"
          role="main"
        >
          <ErrorBoundary
            fallback={
              <div className="p-4 text-red-500">Content failed to load</div>
            }
          >
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
