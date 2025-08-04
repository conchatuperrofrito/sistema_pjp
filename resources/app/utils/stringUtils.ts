/**
 * Truncates the given text based on the specified mode.
 *
 * @param text - The text to be truncated.
 * @param maxLength - The maximum length of the truncated text.
 * @param truncateMode - The mode of truncation: "truncateWithEllipsis" or "truncateLastWord".
 * @returns The truncated text.
 */
export function truncateText (
  text: string,
  maxLength: number,
  truncateMode: "truncateWithEllipsis" | "truncateLastWord" = "truncateWithEllipsis"
): string {
  if (text.length <= maxLength) {
    return text;
  }

  if (truncateMode === "truncateWithEllipsis") {
    return text.slice(0, maxLength - 3) + "...";
  }

  const words = text.split(" ");
  const lastWord = words.pop();
  if (lastWord) {
    const modifiedLastWord = lastWord[0] + ".";
    words.push(modifiedLastWord);
  }

  const truncatedText = words.join(" ");
  if (truncatedText.length > maxLength) {
    return truncatedText.slice(0, maxLength - 1) + "...";
  }

  return truncatedText;
}

/**
 * Generates a unique ID based on the given text.
 *
 * @param text - The text to generate the unique ID from.
 * @returns A unique ID string.
 */
export function generateUniqueId (text: string): string {
  const baseId = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  let hash = 0;
  for (let i = 0; i < baseId.length; i++) {
    const char = baseId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return `${Math.abs(hash)}`;
}
