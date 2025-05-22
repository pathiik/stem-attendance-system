import PropTypes from "prop-types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Pagination - A component for navigating between pages of content
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) {
  // Calculate visible page range (current-1, current, current+1)
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);
  const pageNumbers = [];

  // Generate array of page numbers to display
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Handle page change with boundary checks
  const handlePageChange = (page) => {
    if (!isLoading && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 my-6">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`p-2 rounded-lg ${
          currentPage === 1 || isLoading
            ? "text-gray-300 cursor-default"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <FiChevronLeft className="w-5 h-5" title="Previous" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={isLoading}
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            currentPage === page
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`p-2 rounded-lg ${
          currentPage === totalPages || isLoading
            ? "text-gray-300 cursor-default"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <FiChevronRight className="w-5 h-5" title="Next" />
      </button>
    </div>
  );
}

// Prop types for Pagination
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired, // Current active page
  totalPages: PropTypes.number.isRequired, // Total number of pages
  onPageChange: PropTypes.func.isRequired, // Function to handle page changes
  isLoading: PropTypes.bool, // Loading state
};

// Default props for Pagination
Pagination.defaultProps = {
  isLoading: false,
};
