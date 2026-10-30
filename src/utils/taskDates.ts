export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateString(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearString, monthString, dayString] = match;
  const date = new Date(Number(yearString), Number(monthString) - 1, Number(dayString));

  if (
    date.getFullYear() !== Number(yearString) ||
    date.getMonth() !== Number(monthString) - 1 ||
    date.getDate() !== Number(dayString)
  ) {
    return null;
  }

  return date;
}

export function formatDateString(value: string): string {
  const date = parseDateString(value.slice(0, 10));
  if (!date) return value;
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
