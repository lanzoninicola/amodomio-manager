import toNumber from "./to-number";

export default function toFixedNumber(
  value: unknown,
  decimals: number = 2
): number {
  const number = toNumber(value);

  return Number(number.toFixed(decimals));
}
