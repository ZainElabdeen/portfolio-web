export function setItem<T>(key: string, value: T | undefined): void {
  if (typeof window === "undefined") {
    // Avoid running on the server
    return;
  }
  try {
    if (value === undefined) {
      console.warn(
        `setItem: Attempted to store undefined value for key "${key}"`
      );
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`setItem: Failed to store value for key "${key}".`, error);
  }
}

export function getItem<T>(key: string): T | undefined {
  if (typeof window === "undefined") {
    // Avoid running on the server
    return undefined;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : undefined;
  } catch (error) {
    console.error(
      `getItem: Failed to retrieve or parse value for key "${key}".`,
      error
    );
    return undefined;
  }
}
