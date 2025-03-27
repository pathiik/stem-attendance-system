// Function to format date from timestamp to readable format
export const formatDate = (timestamp: { seconds: number }): string => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
};

// Function to format phone number to (XXX) XXX-XXXX format
export const formatPhone = (phone: string | number | null | undefined) => {
  if (phone == null) return "N/A";

  const phoneStr = String(phone);
  const cleaned = phoneStr.replace(/\D/g, ""); // Remove non-digit characters

  if (cleaned.length < 10) {
    return phone; // Return the original phone number if not enough digits
  }

  // Format as (XXX) XXX-XXXX
  const areaCode = cleaned.slice(0, 3);
  const firstPart = cleaned.slice(3, 6);
  const secondPart = cleaned.slice(6, 10);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
};
