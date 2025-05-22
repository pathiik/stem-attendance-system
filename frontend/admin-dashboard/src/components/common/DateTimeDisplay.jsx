import PropTypes from "prop-types";
import { FiClock } from "react-icons/fi";

// DateTimeDisplay - Component for displaying dates in various formats
export default function DateTimeDisplay({
  date,
  format = "card",
  showIcon = true,
  className = "",
  locale = "en-US",
}) {
  // Converts various date input types to a Date object
  const convertToDate = (input) => {
    if (!input) return null;

    // Handle Firestore Timestamp
    if (typeof input === "object" && "toDate" in input) {
      return input.toDate();
    }
    // Handle Firestore Timestamp (seconds/nanoseconds format)
    if (typeof input === "object" && "seconds" in input) {
      return new Date(
        input.seconds * 1000 + (input.nanoseconds || 0) / 1000000
      );
    }
    // Already a Date object
    if (input instanceof Date) return input;
    // Handle timestamp (seconds or milliseconds)
    if (typeof input === "number") {
      return input > 9999999999 ? new Date(input) : new Date(input * 1000);
    }

    // Handle date string
    const parsedDate = new Date(input);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const dateObj = convertToDate(date);

  // Return placeholder if date is invalid
  if (!dateObj) {
    return (
      <div
        className={`inline-flex items-center text-sm text-gray-500 ${className}`}
      >
        {showIcon && <FiClock className="mr-1" size={14} />}
        <span>--</span>
      </div>
    );
  }

  // Formats the date according to the specified format
  const formatDate = () => {
    try {
      if (format === "card") {
        // Format: "May 3, 7:30 PM"
        return (
          dateObj.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
          }) +
          ", " +
          dateObj.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      } else if (format === "modal") {
        // Format: "Sat, May 3, 2025 • 7:30 PM"
        const datePart = dateObj.toLocaleDateString(locale, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const timePart = dateObj.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${datePart} • ${timePart}`;
      }
      return dateObj.toString();
    } catch (error) {
      console.error("DateTimeDisplay formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div
      className={`inline-flex items-center text-sm text-gray-500 ${className}`}
    >
      {showIcon && <FiClock className="mr-1" size={14} />}
      <span>{formatDate()}</span>
    </div>
  );
}

// PropTypes for DateTimeDisplay
DateTimeDisplay.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.shape({
      seconds: PropTypes.number,
      nanoseconds: PropTypes.number,
    }),
  ]),
  format: PropTypes.oneOf(["card", "modal", "timeOnly"]),
  showIcon: PropTypes.bool,
  className: PropTypes.string,
  locale: PropTypes.string,
};

// Default props for DateTimeDisplay
DateTimeDisplay.defaultProps = {
  format: "card",
  showIcon: true,
  className: "",
  locale: "en-US",
};
