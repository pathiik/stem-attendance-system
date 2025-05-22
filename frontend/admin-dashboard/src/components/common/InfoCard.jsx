import PropTypes from "prop-types";

// InfoCard - Displays labeled information with an icon and content
export default function InfoCard({
  icon,
  title,
  content,
  className = "",
  isEmail = false,
}) {
  // Validate and sanitize the content
  if (!content) {
    console.warn(`InfoCard: Missing content for "${title}"`);
    content = "Not available";
  }

  // Clean string content by trimming whitespace
  if (typeof content === "string") {
    content = content.trim();
  }

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Icon container with consistent styling */}
      <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">{icon}</div>

      {/* Content container */}
      <div className="min-w-0">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <div className="text-gray-600 break-words">
          {isEmail ? (
            <a
              href={`mailto:${content}`}
              className="hover:text-primary hover:underline"
            >
              {content}
            </a>
          ) : typeof content === "string" ? (
            <p>{content}</p>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}

// PropTypes for InfoCard
InfoCard.propTypes = {
  icon: PropTypes.node.isRequired, // Icon to display
  title: PropTypes.string.isRequired, // Title of the card
  content: PropTypes.node.isRequired, // Content to display
  className: PropTypes.string, // Additional CSS classes for styling
  isEmail: PropTypes.bool, // Whether the content is an email address
};

// Default props for InfoCard
InfoCard.defaultProps = {
  className: "",
  isEmail: false,
};
