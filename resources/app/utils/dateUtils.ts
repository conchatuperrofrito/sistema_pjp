/**
 * Returns the current date in the format yyyy-mm-dd
 */
export function getCurrentDate (): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
}

/**
 * Returns the current time in the format hh:mm
 */
export function getCurrentTime (): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}
