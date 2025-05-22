import PropTypes from "prop-types";

import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

// ModalActions - A standardized action button group for modals
export default function ModalActions({
  onClose,
  onConfirm,
  confirmText = "Confirm",
  confirmDisabled = false,
}) {
  return (
    <div
      className="flex justify-end gap-3 pt-4 border-t border-gray-200"
      aria-label="Modal actions" // Accessibility label
    >
      <SecondaryButton
        onClick={onClose}
        aria-label="Close modal" // Accessibility label
      >
        Close
      </SecondaryButton>
      <PrimaryButton
        onClick={onConfirm}
        disabled={confirmDisabled}
        aria-label={confirmText} // Accessibility label
      >
        {confirmText}
      </PrimaryButton>
    </div>
  );
}

// Prop types for ModalActions
ModalActions.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to call when closing the modal
  onConfirm: PropTypes.func.isRequired, // Function to call when confirming the action
  confirmText: PropTypes.string, // Text for the confirm button
  confirmDisabled: PropTypes.bool, // Whether the confirm button is disabled
};

// Default props for ModalActions
ModalActions.defaultProps = {
  confirmText: "Confirm",
  confirmDisabled: false,
};
