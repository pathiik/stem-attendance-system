import PropTypes from "prop-types";

import { IoClose } from "react-icons/io5";
import { FiUser, FiMail, FiBook } from "react-icons/fi";

import DateTimeDisplay from "../common/DateTimeDisplay";
import InfoCard from "../common/InfoCard";
import StatusBadge from "../common/StatusBadge";
import ModalActions from "../common/modals/ModalActions";

// MessageModal - Displays detailed message information in a modal dialog

export default function MessageModal({ message, onClose, onAddTask }) {
  // Validate message object with error fallback UI
  if (!message || typeof message !== "object") {
    console.error("MessageModal: Invalid message prop");
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600">Invalid Message</h2>
          <p className="mt-2 text-gray-700">
            The message data could not be loaded.
          </p>
          <PrimaryButton onClick={onClose} className="mt-4">
            Close
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // Handle adding task action (currently a placeholder - unimplemented)
  const handleAddTask = () => {
    try {
      onAddTask();
      onClose();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-modal-title"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2
                id="message-modal-title"
                className="text-2xl font-bold text-gray-900"
              >
                {message.subject || "No Subject"}
              </h2>
              <div className="mt-2">
                <DateTimeDisplay
                  date={message.created_at}
                  format="modal"
                  showIcon
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
              aria-label="Close modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Sender/Recipient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <InfoCard
                icon={<FiUser size={18} />}
                title="Student"
                content={message.student_name || "Not specified"}
              />
              <InfoCard
                icon={<FiUser size={18} />}
                title="Sender"
                content={message.sender_name || "Unknown sender"}
              />
            </div>
            <div className="space-y-4">
              <InfoCard
                icon={<FiMail size={18} />}
                title="Email"
                content={message.sender_email || "No email"}
                isEmail={true}
              />
              <InfoCard
                icon={<FiBook size={18} />}
                title="Status"
                content={
                  <StatusBadge
                    status={message.status === "unread" ? "Unread" : "Read"}
                    showIcon
                  />
                }
              />
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Message</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg min-h-[100px]">
              {message.description || "No message content"}
            </div>
          </div>

          {/* Standardized Modal Actions */}
          <ModalActions
            onClose={onClose}
            onConfirm={handleAddTask}
            confirmText="Add to Tasks"
          />
        </div>
      </div>
    </div>
  );
}

// PropTypes for MessageModal
MessageModal.propTypes = {
  // Message object containing details to display
  message: PropTypes.shape({
    subject: PropTypes.string,
    created_at: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.shape({
        seconds: PropTypes.number,
        nanoseconds: PropTypes.number,
      }),
    ]).isRequired,
    student_name: PropTypes.string,
    sender_name: PropTypes.string,
    sender_email: PropTypes.string,
    status: PropTypes.oneOf(["read", "unread"]),
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
};

// Default props for MessageModal
MessageModal.defaultProps = {
  onClose: () => console.warn("onClose callback not provided to MessageModal"),
  onAddTask: () =>
    console.warn("onAddTask callback not provided to MessageModal"),
};
