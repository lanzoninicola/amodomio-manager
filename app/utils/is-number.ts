/**
 * Checks if a value passed is a number despite its type.
 *
 * @param {any} value
 * @returns {boolean} true if value is a number otherwise false
 */
export default function isNumber(value: unknown) {
  if (
    value === null ||
    value === "null" ||
    value === undefined ||
    value === "undefined" ||
    value === "" ||
    isNaN(Number(value))
  ) {
    return false;
  }

  return typeof Number(value) === "number";
}
