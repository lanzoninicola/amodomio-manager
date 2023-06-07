import { serverError } from "./http-response.server";

export default function toNumber(value: unknown): number {
  if (value === undefined) {
    value = 0;
  }

  const number = Number(value);

  if (isNaN(number)) {
    serverError(`"${value}" is not a number`);
  }

  return number;
}
