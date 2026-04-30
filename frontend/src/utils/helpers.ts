export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date?: string | null) {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString();
}
