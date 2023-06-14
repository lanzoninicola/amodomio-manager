export function jsonParse(json: any) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return undefined;
  }
}

export function jsonStringify(obj: any) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return undefined;
  }
}
