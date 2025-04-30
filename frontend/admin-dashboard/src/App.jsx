import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Function to update the page title
const updatePageTitle = (title) => {
  document.title = `STEM | ${title}`;
  return null;
};

// ProtectedRoute component to protect routes
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth(); // Get current user and loading state from AuthContext

  // Redirect to auth page if user is not authenticated
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return currentUser ? <Outlet /> : <AuthPage />;
};

// AppWrapper component to wrap the application with AuthProvider
const AppWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// Router configuration
const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <div>Dashboard</div>,
        loader: () => updatePageTitle("Dashboard"), // Update page title
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
    loader: () => updatePageTitle("Authentication"),
  },
]);

// Main App component
function App() {
  return (
    <AppWrapper>
      <RouterProvider router={router} />
    </AppWrapper>
  );
}

export default App;
