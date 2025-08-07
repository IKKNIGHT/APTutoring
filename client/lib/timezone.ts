// Timezone utility functions

// Get the user's timezone
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Format date in user's timezone
export function formatDateInUserTimezone(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: userTimezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
}

// Format time in user's timezone
export function formatTimeInUserTimezone(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: userTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleTimeString("en-US", { ...defaultOptions, ...options });
}

// Get timezone abbreviation (e.g., "EST", "PST")
export function getTimezoneAbbreviation(): string {
  const date = new Date();
  const userTimezone = getUserTimezone();

  // Get the short timezone name
  const timeZoneName = date
    .toLocaleDateString("en-US", {
      timeZone: userTimezone,
      timeZoneName: "short",
    })
    .split(", ")[1];

  return timeZoneName || userTimezone.split("/").pop() || "Local";
}

// Format full date and time with timezone
export function formatFullDateTime(dateString: string): {
  date: string;
  time: string;
  timezone: string;
} {
  return {
    date: formatDateInUserTimezone(dateString),
    time: formatTimeInUserTimezone(dateString),
    timezone: getTimezoneAbbreviation(),
  };
}

// Format compact date for dashboard cards
export function formatCompactDate(dateString: string): string {
  const date = new Date(dateString);
  const userTimezone = getUserTimezone();

  return date.toLocaleDateString("en-US", {
    timeZone: userTimezone,
    month: "short",
    day: "numeric",
  });
}
