// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
