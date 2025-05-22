import { useState } from "react";
import { useMessages } from "../../hooks/useMessages";

import { LuMail, LuMailOpen } from "react-icons/lu";
import Spinner from "../../components/ui/Spinner";
import SearchBar from "../../components/search/SearchBar";
import TabButtons from "../../components/ui/TabButtons";
import MessageCard from "../../components/cards/MessageCard";

// Messages component - Displays a list of messages with search and filter functionality
export default function Messages() {
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [activeTab, setActiveTab] = useState("unread"); // Active filter tab
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [actionError, setActionError] = useState(null); // Error message state

  // Message data from custom hook
  const { messages, loading, error, markMessageAsRead, addMessageToTasks } =
    useMessages();

  // Tab configuration
  const tabs = [
    { id: "unread", label: "Unread", icon: <LuMail /> },
    { id: "read", label: "Read", icon: <LuMailOpen /> },
  ];

  // Filter messages based on search term and active tab
  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      message.subject?.toLowerCase().includes(searchLower) ||
      message.description?.toLowerCase().includes(searchLower) ||
      message.sender_name?.toLowerCase().includes(searchLower) ||
      message.sender_email?.toLowerCase().includes(searchLower);

    return activeTab === "unread"
      ? matchesSearch && message.status === "unread"
      : matchesSearch && message.status === "read";
  });

  // Mark message as read and show feedback
  const handleMarkRead = async (id) => {
    try {
      await markMessageAsRead(id);
      setSuccessMessage("Message marked as read");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setActionError(`Failed to mark as read: ${error.message}`);
      setTimeout(() => setActionError(null), 5000);
    }
  };

  // Converts a message to as task and shows feedback
  const handleAddTask = async (message) => {
    try {
      await addMessageToTasks(message.id);
      setSuccessMessage("Message converted to task");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setActionError(`Failed to create task: ${error.message}`);
      setTimeout(() => setActionError(null), 5000);
    }
  };

  // Loading state - shows centered spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state - shows full page error
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h3 className="font-bold">Error loading messages</h3>
        <p>{error.message || "Please try refreshing the page"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      </div>

      {/* Success and error feedback */}
      {successMessage && (
        <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {actionError}
        </div>
      )}

      {/* Tab navigation */}
      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {/* Search bar */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search messages..."
        className="mb-4"
      />

      {/* Messages list */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onMarkRead={() => handleMarkRead(message.id)}
              onAddTask={() => handleAddTask(message)}
            />
          ))
        ) : (
          /* Empty state */
          <div className="bg-white p-8 rounded-lg shadow text-center">
            {activeTab === "unread" ? (
              <LuMail className="mx-auto text-gray-400 mb-2" size={48} />
            ) : (
              <LuMailOpen className="mx-auto text-gray-400 mb-2" size={48} />
            )}

            <h3 className="text-lg font-medium text-gray-700">
              No {activeTab === "unread" ? "unread" : "read"} messages
            </h3>
            {searchTerm && (
              <p className="text-gray-500 mt-1">
                No matches found for "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
