import { z } from "zod";

export function getTimezoneInfo(latitude?: number, longitude?: number) {
  if (!latitude || !longitude) {
    return "Timezone not available";
  }

  // Use the browser's timezone as fallback
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get current date to calculate offset
  const now = new Date();
  const offset = -now.getTimezoneOffset() / 60;

  // Format offset
  const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;

  // Get timezone name
  const timezoneName =
    new Intl.DateTimeFormat("en", {
      timeZoneName: "long",
      timeZone: userTimezone,
    })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return `GMT${offsetString} (${timezoneName})`;
}

export function addMinutesToTimeString(timeStr: string, minutesToAdd: number) {
  const { success, data } = z
    .string()
    .regex(/^(\d{2}):(\d{2})$/)
    .safeParse(timeStr);
  if (!success) {
    // Invalid time string
    return timeStr;
  }
  // Split the string into hours and minutes
  const [hours, minutes] = data.split(":").map(Number);

  // Create a Date object for today with the given time
  const date = new Date();
  date.setHours(hours!, minutes, 0, 0);

  // Add the minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  // Format back to HH:MM
  const newHours = String(date.getHours()).padStart(2, "0");
  const newMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${newHours}:${newMinutes}`;
}

/**
 * Returns the delay in milliseconds from now until the next occurrence of the given time (with offset).
 * @param timeStr - "HH:MM" (24-hour format)
 * @param offsetMinutes - Minutes to add to the time (can be negative)
 */
export function getDelayUntilTime(
  timeStr: string,
  offsetMinutes: number,
): number {
  const { success, data } = z
    .string()
    .regex(/^(\d{2}):(\d{2})$/)
    .safeParse(timeStr);

  if (!success) {
    // Invalid time string
    return 0;
  }

  const [hours, minutes] = data.split(":").map(Number);

  // Create a Date object for the next occurrence of the target time
  const now = new Date();
  const target = new Date(now);

  target.setHours(hours!, minutes, 0, 0);
  target.setMinutes(target.getMinutes() + offsetMinutes);

  // If the target time has already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}
