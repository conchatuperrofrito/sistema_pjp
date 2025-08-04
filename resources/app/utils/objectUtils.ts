/**
 * Recursively removes all properties with `null` values from an object.
 *
 * @template T - The type of the object being processed. Must extend `Record<string, unknown>`.
 * @param obj - The object from which `null` values should be removed.
 * @returns A new object of the same type as the input, with all `null` values removed.
 *
 * @example
 * const input = {
 *   a: 1,
 *   b: null,
 *   c: {
 *     d: null,
 *     e: 2
 *   }
 * };
 * const result = removeNullValuesFromObject(input);
 * // result: { a: 1, c: { e: 2 } }
 */
export const removeNullValuesFromObject = <T>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .map(([key, value]) =>
        value && typeof value === "object" && !Array.isArray(value)
          ? [key, removeNullValuesFromObject(value)]
          : value !== null
            ? [key, value]
            : []
      )
      .filter(entry => entry.length > 0)
  ) as T;
};
