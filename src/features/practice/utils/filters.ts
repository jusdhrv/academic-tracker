export function toggleFilterValue(value: string, current: string[]): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
}
