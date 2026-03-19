export function createId(): string {
  // Good enough for local-only IDs without adding a UUID dependency.
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

