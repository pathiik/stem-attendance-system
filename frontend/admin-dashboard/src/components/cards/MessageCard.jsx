import { useState } from "react";
import PropTypes from "prop-types";

import { FiPlus, FiCheck, FiUser } from "react-icons/fi";

import MessageModal from "../modals/MessageModal";
import DateTimeDisplay from "../common/DateTimeDisplay";

// NewIndicator - Badge component for indicating new/unread messages
function NewIndicator() {
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-500 rounded-full animate-fade-in border border-blue-100"
      aria-label="New message"
    >
      NEW
    </span>
  );
}

// MessageCard - Component for displaying message previews with interaction capabilities
export default function MessageCard({ message, onMarkRead, onAddTask }) {
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility
  const isUnread = message?.status === "unread";

  // Opens the message modal
  const handleOpenModal = () => {
    if (!message) return;
    setIsOpen(true);
  };

  // Closes the message modal and marks the message as read if needed
  const handleCloseModal = () => {
    setIsOpen(false);
    // Only mark as read when closing the modal if it was unread
    if (isUnread && message.id) {
      onMarkRead(message.id);
    }
  };

  // Handles aading task from message
  const handleAddTask = (e) => {
    e.stopPropagation();
    onAddTask(message);
  };

  // Handle missing message
  if (!message) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 text-gray-500">
        Message not available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="p-4 cursor-pointer" onClick={handleOpenModal}>
        {/* Header with status and date */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {isUnread && <NewIndicator />}
            <h3 className="font-medium text-primary">
              {message.subject || "No subject"}
            </h3>
          </div>
          <DateTimeDisplay
            date={message.created_at}
            format="card"
            className="text-xs text-gray-500"
          />
        </div>

        {/* Sender info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FiUser className="text-gray-400" size={14} />
          <span>{message.student_name || "Unknown sender"}</span>
        </div>

        {/* Message preview */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {message.description || "No message content"}
        </p>

        {/* Footer with actions */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 truncate max-w-[50%]">
            From: {message.sender_name || "Unknown"}
          </span>

          <div className="flex gap-2">
            {isUnread && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(message.id);
                }}
                className="text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded flex items-center gap-1 transition-colors"
              >
                <FiCheck size={14} /> Mark read
              </button>
            )}
            <button
              onClick={handleAddTask}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded flex items-center gap-1 transition-colors"
            >
              <FiPlus size={14} /> Add task
            </button>
          </div>
        </div>
      </div>

      {/* Message modal */}
      {isOpen && (
        <MessageModal
          message={message}
          onClose={handleCloseModal}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}

// PropTypes for MessageCard
MessageCard.propTypes = {
  // Message object containing details
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subject: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    student_name: PropTypes.string,
    sender_name: PropTypes.string,
    status: PropTypes.oneOf(["unread", "read"]),
  }).isRequired, // Message object
  onMarkRead: PropTypes.func.isRequired, // Function to mark message as read
  onAddTask: PropTypes.func.isRequired, // Function to add task from message
};

// Default props for MessageCard
MessageCard.defaultProps = {
  message: null,
  onMarkRead: () => {},
  onAddTask: () => {},
};
