import { useState, useEffect } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useStudents } from "../../hooks/useStudents";

import {
  FiUsers,
  FiUser,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";

import Spinner from "../../components/ui/Spinner";
import DashboardCard from "../../components/cards/DashboardCard";

// Dashboard component - Displays an overview of key metrics and statistics
export default function Dashboard() {
  // Fetch data from custom hooks
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudents();
  const {
    unreadCount,
    loading: messagesLoading,
    error: messagesError,
  } = useMessages();

  // State for error handling
  const [error, setError] = useState(null);

  // Combine loading states
  const isLoading = studentsLoading || messagesLoading;

  // Effect to handle errors from hooks
  useEffect(() => {
    const error = studentsError || messagesError;
    if (error) {
      setError({
        message: "Failed to load dashboard data",
        details: error.message || "Please try refreshing the page",
      });

      // Clear error after 5 seconds
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [studentsError, messagesError]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Error Message */}
      {error && (
        <div
          className="p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
          {error.details && <p className="text-sm">{error.details}</p>}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {/* Stats Cards - Only show when not loading */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Students"
            value={students?.length || 0}
            icon={<FiUsers />}
            to="/students"
          />

          <DashboardCard
            title="Total Teachers"
            value="0" // Placeholder until teacher database is implemented
            icon={<FiUser />}
            to="/teachers"
            disabled={true} // Add disabled state since not implemented
          />

          <DashboardCard
            title="Active Students"
            value={students?.filter((s) => s.status === "Present").length || 0}
            to="/students?status=present"
          />

          <DashboardCard
            title="New Messages"
            value={unreadCount}
            icon={<FiMessageSquare />}
            to="/messages"
          />

          <DashboardCard
            title="Pending Tasks"
            value="0" // Placeholder until task database is implemented
            icon={<FiAlertCircle />}
            to="/tasks"
          />
        </div>
      )}
    </div>
  );
}
