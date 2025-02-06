export function formatString(input: string): string {
    return input
      .trim() // Remove leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-"); // Replace spaces with dashes
  }

  export function formatDateToYYYYMMDDHHMMSS(date:Date):string {
    return date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0') +
        date.getHours().toString().padStart(2, '0') +
        date.getMinutes().toString().padStart(2, '0') +
        date.getSeconds().toString().padStart(2, '0');
}
  