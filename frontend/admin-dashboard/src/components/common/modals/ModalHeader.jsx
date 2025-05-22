import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import DateTimeDisplay from "../DateTimeDisplay";

// ModalHeader - A standardized header component for modal dialogs
export default function ModalHeader({ title, date, onClose }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {date && (
          <div className="mt-2">
            <DateTimeDisplay
              date={date}
              format="modal"
              showIcon
              aria-label="Date" // Accessibility label
            />
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
        aria-label="Close modal" // Accessibility label
      >
        <IoClose size={24} />
      </button>
    </div>
  );
}

// Prop types for ModalHeader
ModalHeader.propTypes = {
  title: PropTypes.string.isRequired, // Title text for the modal
  date: PropTypes.oneOfType([
    PropTypes.string, // ISO date string
    PropTypes.number, // Timestamp
    PropTypes.instanceOf(Date), // Date object
  ]).isRequired, // The date to display
  onClose: PropTypes.func.isRequired, // Function to handle close action
};
