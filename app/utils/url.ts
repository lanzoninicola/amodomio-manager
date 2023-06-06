export function urlAt(str: string, index: number) {
  return str.split("/").at(index);
}

export function lastUrlSegment(str: string) {
  return str.split("/").at(-1);
}

export function urlAtOr(str: string, index: number, fallback: string) {
  return urlAt(str, index) || fallback;
}
