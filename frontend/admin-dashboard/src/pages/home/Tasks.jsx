import { useState } from "react";

import {
  FiCheckCircle,
  FiPlus,
  FiCheck,
  FiClock,
  FiFilter,
  FiTrash2,
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";

import SearchBar from "../../components/search/SearchBar";
import TabButtons from "../../components/ui/TabButtons";

// Tasks Component - Manages and displays a list of tasks with search, filter, and add functionality
export default function Tasks() {
  // Mock data for tasks
  const mockTasks = [
    {
      id: "1",
      title: "Review science fair projects",
      description:
        "Need to review all submitted projects for the upcoming science fair",
      dueDate: "2023-06-15",
      status: "pending",
      priority: "high",
      assignedTo: "Admin",
    },
    {
      id: "2",
      title: "Schedule parent-teacher meetings",
      description:
        "Coordinate with teachers to schedule meetings for next week",
      dueDate: "2023-05-20",
      status: "pending",
      priority: "medium",
      assignedTo: "Admin",
    },
    {
      id: "3",
      title: "Order lab supplies",
      description: "Place order for new chemistry lab equipment",
      dueDate: "2023-05-10",
      status: "completed",
      priority: "low",
      assignedTo: "Admin",
    },
    {
      id: "4",
      title: "Prepare exam schedule",
      description: "Create schedule for end-of-term examinations",
      dueDate: "2023-06-01",
      status: "pending",
      priority: "high",
      assignedTo: "Admin",
    },
    {
      id: "5",
      title: "Update student records",
      description: "Verify and update all student records for new semester",
      dueDate: "2023-05-25",
      status: "completed",
      priority: "medium",
      assignedTo: "Admin",
    },
  ];

  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [tasks, setTasks] = useState(mockTasks); // Task data (MOCK DATA CURRENTLY)
  const [activeTab, setActiveTab] = useState("pending"); // Active filter tab
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  // State for new task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });
  const [filterPriority, setFilterPriority] = useState("all"); // State for filtering tasks by priority
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  // Tab configuration
  const tabs = [
    { id: "pending", label: "Pending", icon: <FiClock /> },
    { id: "completed", label: "Completed", icon: <FiCheck /> },
  ];

  // Filter tasks based on search term, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower);

    const matchesStatus = task.status === activeTab;

    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      setError("Title and due date are required");
      return;
    }

    const newTaskObj = {
      ...newTask,
      id: Date.now().toString(),
      status: "pending",
      assignedTo: "Admin",
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    });
    setIsModalOpen(false);
    setSuccess("Task added successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle status change for a task
  const handleStatusChange = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
    setSuccess(`Task marked as ${newStatus}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle deleting a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setSuccess("Task deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Returns appropriate color class based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Returns appropriate icon based on priority
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <FiAlertTriangle className="text-red-500" />;
      case "medium":
        return <FiAlertCircle className="text-yellow-500" />;
      case "low":
        return <FiInfo className="text-green-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Task button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Task
        </button>
      </div>

      {/* Success and error messages */}
      {success && (
        <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tab navigation and priority filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <TabButtons tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-500" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Search bar */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search tasks..."
      />

      {/* Tasks list */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                task.priority === "high"
                  ? "border-red-500 bg-red-50/30"
                  : task.priority === "medium"
                  ? "border-yellow-500 bg-yellow-50/30"
                  : "border-gray-300 bg-gray-50"
              } hover:shadow-md transition-shadow`}
            >
              {/* Task content */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPriorityIcon(task.priority)}
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                  </div>
                  <div className="pl-6">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-gray-500 flex items-center">
                        <FiClock className="mr-1" />
                        Due: {formatDate(task.dueDate)}
                      </span>
                      <span className="text-gray-500">
                        Assigned to: {task.assignedTo}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Task actions */}
                <div className="flex space-x-1 ml-2">
                  {activeTab === "pending" && (
                    <button
                      onClick={() => handleStatusChange(task.id, "completed")}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
                      title="Mark as completed"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  {activeTab === "completed" && (
                    <button
                      onClick={() => handleStatusChange(task.id, "pending")}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Reopen task"
                    >
                      <FiClock size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete task"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No {activeTab} tasks found matching your criteria
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Task</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Task form fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent min-h-[100px]"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {newTask.description.length}/500
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date*
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority*
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Form actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTask}
                    disabled={!newTask.title || !newTask.dueDate}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
