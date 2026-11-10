export function writeEntry<Value>(record: Record<string, Value>, key: string, value: Value) {
  // Account IDs can match the inherited prototype setter.
  if (key === '__proto__') return { ...record, [key]: value }

  record[key] = value
  return record
}
