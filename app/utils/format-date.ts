/**
 *
 * @param {Date} date
 * @param {string} separator
 * @returns {string} the date in the format DD-MM-YYYY.
 */
const formatDate = (date: Date | null, separator = "-") => {
  if (date === null || date === undefined) {
    return "";
  }

  const nextDate = typeof date === "string" ? new Date(date) : date;

  const year = nextDate.getFullYear();
  const month = (nextDate.getMonth() + 1).toString().padStart(2, "0");
  const day = nextDate.getDate().toString().padStart(2, "0");
  return `${day}${separator}${month}${separator}${year}`;
};

export default formatDate;
