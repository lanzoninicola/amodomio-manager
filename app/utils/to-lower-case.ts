export default function toLowerCase(str: string): string {
  if (typeof str !== "string") return str;
  if (str.length === 0) return str;

  return str.toLowerCase();
}
