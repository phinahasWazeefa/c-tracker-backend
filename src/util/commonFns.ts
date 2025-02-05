export function formatString(input: string): string {
    return input
      .trim() // Remove leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-"); // Replace spaces with dashes
  }
  