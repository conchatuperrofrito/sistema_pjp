/**
 * Retrieves the value of a cookie by its name.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string | undefined} The value of the cookie if found, otherwise undefined.
 */
export function getCookie (name: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}
