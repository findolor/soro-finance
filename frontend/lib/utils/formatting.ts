/**
 * Format a date string to a more readable format
 * @param dateString The date string to format
 * @returns Formatted date string or "N/A" if null
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
}

/**
 * Truncate text to a specified length and add ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
