export const isAmountInRange = (n: number, min: number, max: number) =>
  Number.isInteger(n) && n >= min && n <= max
