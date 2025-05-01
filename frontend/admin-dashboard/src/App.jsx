import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AuthPage from "./pages/auth/AuthPage";
import Layout from "./components/layout/Layout";
import Error404Page from "./pages/Error404Page";

// Function to update the page title
const updatePageTitle = (title) => {
  document.title = `${title} – STEM`;
  return null;
};

// ProtectedRoute component to protect routes
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth(); // Get current user and loading state from AuthContext

  // Redirect to auth page if user is not authenticated
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return currentUser ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/auth" replace /> // Redirect to auth page if not authenticated
  );
};

// AuthRoute component to handle authentication routes
const AuthRoute = () => {
  const { currentUser, loading } = useAuth(); // Get current user and loading state from AuthContext

  // Redirect to dashboard if user is authenticated
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return currentUser ? (
    <Navigate to="/" replace /> // Redirect to dashboard if authenticated
  ) : (
    <AuthPage />
  );
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
        element: <div>Dashboard – Coming Soon!</div>,
        loader: () => updatePageTitle("Dashboard"), // Update page title
      },
      {
        path: "/students",
        element: <div>Students – Coming Soon!</div>,
        loader: () => updatePageTitle("Students"),
      },
      {
        path: "/teachers",
        element: <div>Teachers – Coming Soon!</div>,
        loader: () => updatePageTitle("Teachers"),
      },
      {
        path: "/messages",
        element: <div>Messages – Coming Soon!</div>,
        loader: () => updatePageTitle("Messages"),
      },
      {
        path: "/tasks",
        element: <div>Tasks – Coming Soon!</div>,
        loader: () => updatePageTitle("Tasks"),
      },
      {
        path: "/settings",
        element: <div>Settings – Coming Soon!</div>,
        loader: () => updatePageTitle("Settings"),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthRoute />,
    loader: () => updatePageTitle("Authentication"),
  },
  {
    path: "*",
    element: <Error404Page />,
    loader: () => updatePageTitle("Page Not Found"),
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
