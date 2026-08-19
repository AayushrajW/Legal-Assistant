export function greetingForNow(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function firstName(displayName?: string): string {
  if (!displayName) return "there";
  return displayName.split(" ")[0];
}
