import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStudents } from "../../../hooks/useStudents";
import { useAuth } from "../../../context/AuthContext";

import SearchBar from "../../../components/search/SearchBar";
import ExpandableCard from "../../../components/cards/ExpandableCard";
import Pagination from "../../../components/ui/Pagination";
import TabButtons from "../../../components/ui/TabButtons";
import Spinner from "../../../components/ui/Spinner";

// Constants for configuration
const ITEMS_PER_PAGE = 10;
const TABS = [
  { id: "all", label: "All" },
  { id: "present", label: "Present" },
  { id: "absent", label: "Absent" },
];

// Students component - Displays a list of students with search and filter functionality
export default function Students() {
  // Navigation and location hook for
  const navigate = useNavigate();
  const location = useLocation();

  // Component state management
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [activeTab, setActiveTab] = useState("all"); // Active filter tab
  const [error, setError] = useState(null); // Error message state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Custom hooks for data and authentication
  const { students, addStudent, loading: studentsLoading } = useStudents();
  const { currentUser } = useAuth();

  // Parse URL parameters to set initial active tab (for linked navigation from other pages)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get("status");

    if (statusParam && TABS.some((tab) => tab.id === statusParam)) {
      setActiveTab(statusParam);
    }
  }, [location.search]);

  // Memoized filtered students list
  const filteredStudents = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    let filtered = students.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        (student.studentId &&
          student.studentId.toLowerCase().includes(searchLower))
    );

    // Apply status filter if not showing all students
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (student) => student.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    return filtered;
  }, [searchTerm, students, activeTab]);

  // Memoized paginated students list
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // Function to handle adding a new student
  const handleAddStudent = async () => {
    // Validation
    if (!currentUser) {
      setError("You must be logged in to add students");
      return;
    }

    if (studentsLoading) {
      setError("Please wait while student data loads");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // MOCK STUDENT DATA (for demonstration purposes - to be replaced with actual data)
      const newStudent = {
        name: "New Student",
        email: `new.student${Math.floor(Math.random() * 1000)}@stem.ca`,
        studentId: `S-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Present",
        grade: "Grade 9",
        attendance: "100%",
      };

      await addStudent(newStudent);

      // Success feedback
      setError("New student added successfully!");
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error("Student creation failed:", error);
      setError(error.message || "Failed to add student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // StudentsStatus Component (internal)
  const StudentsStatus = () => (
    <div className="text-sm text-gray-600">
      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
      {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of{" "}
      {filteredStudents.length} student
      {filteredStudents.length !== 1 ? "s" : ""}
    </div>
  );

  // Empty state for no students found
  const EmptyState = () => (
    <div className="text-center py-10">
      <p className="text-gray-500">
        {searchTerm
          ? "No students match your search criteria"
          : activeTab !== "all"
          ? `No ${activeTab} students found`
          : "No students available"}
      </p>
    </div>
  );

  // Loading state for initial student data
  if (studentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary border border-primary transition-all disabled:opacity-50"
          onClick={handleAddStudent}
          disabled={isLoading || studentsLoading}
          aria-label="Add new student"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Adding...
            </>
          ) : (
            "Add Student"
          )}
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div
          className={`p-2 rounded-md ${
            error.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-500"
          }`}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search students by name, email, or ID..."
          aria-label="Search students"
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabButtons
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="w-full sm:w-auto"
            aria-label="Filter students by status"
          />
          <StudentsStatus />
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-wrap -mx-2">
          {paginatedStudents.map((student) => (
            <ExpandableCard
              key={student.id}
              item={{
                ...student,
                studentId: student.id, // Ensure consistent ID naming
              }}
              type="students"
              onClick={() => navigate(`/students/${student.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
