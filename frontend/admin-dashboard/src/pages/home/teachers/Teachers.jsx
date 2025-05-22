import { useState, useEffect, useMemo } from "react";

import SearchBar from "../../../components/search/SearchBar";
import ExpandableCard from "../../../components/cards/ExpandableCard";
import Pagination from "../../../components/ui/Pagination";

// Fake data generation function for demo purposes
const fakeTeachers = () => {
  const teachers = [];
  for (let i = 1; i <= 50; i++) {
    teachers.push({
      id: i,
      name: `Teacher ${i}`,
      email: `teacher_${i}@stem.ca`,
    });
  }
  return teachers;
};

const ITEMS_PER_PAGE = 12; // Number of items per page

// Teachers component - Displays a list of teachers with search and pagination functionality
export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const allTeachers = useMemo(() => fakeTeachers(), []); // Memoized list of all teachers

  // Filter teachers based on the search term
  const filteredTeachers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return allTeachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, allTeachers]);

  // Paginate the filtered teachers
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Add Teacher
        </button>
      </div>

      {/* Search bar */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search teachers..."
      />

      {/* Display number of teachers */}
      <div className="text-sm text-right text-gray-600">
        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
        {Math.min(currentPage * ITEMS_PER_PAGE, filteredTeachers.length)} of{" "}
        {filteredTeachers.length} teachers
      </div>

      {/* Teachers list */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap -mx-2">
          {paginatedTeachers.map((teacher) => (
            <ExpandableCard key={teacher.id} item={teacher} type="teachers" />
          ))}
        </div>

        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
