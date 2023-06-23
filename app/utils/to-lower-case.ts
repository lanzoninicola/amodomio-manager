export default function toLowerCase(str: unknown): string {
  if (typeof str !== "string") return str as string;
  if (str.length === 0) return str;

  return str.toLowerCase().trim();
}
