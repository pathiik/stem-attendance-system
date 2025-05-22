import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FirebaseProvider } from "./context/FirebaseContext";

// Page imports
import AuthPage from "./pages/auth/AuthPage";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/home/Dashboard";
import Students from "./pages/home/students/Students";
import StudentDetails from "./pages/home/students/StudentDetails";
import Teachers from "./pages/home/teachers/Teachers";
import TeacherDetails from "./pages/home/teachers/TeacherDetails";
import Messages from "./pages/home/Messages";
import Tasks from "./pages/home/Tasks";
import Settings from "./pages/home/Settings";
import Error404Page from "./pages/Error404Page";

// Updates the document title dynamically based on the current page
const updatePageTitle = (title) => {
  document.title = `${title} – STEM`;
  return null;
};

// ProtectedRoute - Wrapper component for routes that require authentication
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth(); // Get current user and loading state from AuthContext

  // Show loading state while checking authentication
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

// AuthRoute - Specific route for authentication
const AuthRoute = () => {
  const { currentUser, loading } = useAuth(); // Get current user and loading state from AuthContext

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return currentUser ? (
    <Navigate to="/" replace /> // Redirect to dashboard if authenticated
  ) : (
    <AuthPage />
  );
};

// AppWrapper - Top-level wrapper for the application
const AppWrapper = ({ children }) => {
  return (
    <AuthProvider>
      <FirebaseProvider>{children}</FirebaseProvider>
    </AuthProvider>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        loader: () => updatePageTitle("Dashboard"), // Update page title
      },
      {
        path: "/students",
        element: <Students />,
        loader: () => updatePageTitle("Students"),
      },
      {
        path: "/students/:id",
        element: <StudentDetails />,
        loader: () => updatePageTitle("Student Details"),
      },
      {
        path: "/teachers",
        element: <Teachers />,
        loader: () => updatePageTitle("Teachers"),
      },
      {
        path: "/teachers/:id",
        element: <TeacherDetails />,
        loader: () => updatePageTitle("Teacher Details"),
      },
      {
        path: "/messages",
        element: <Messages />,
        loader: () => updatePageTitle("Messages"),
      },
      {
        path: "/tasks",
        element: <Tasks />,
        loader: () => updatePageTitle("Tasks"),
      },
      {
        path: "/settings",
        element: <Settings />,
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
