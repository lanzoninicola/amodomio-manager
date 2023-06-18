export default function trim(str: string) {
  if (!str) return str;

  if (typeof str !== "string") {
    return str;
  }

  return str.trim();
}
