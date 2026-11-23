export const CAMPUS_TIME_ZONE = "Asia/Kuala_Lumpur";

export function formatBookingDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: CAMPUS_TIME_ZONE,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatBookingTimeRange(startIso: string, endIso: string): string {
  try {
    const dStart = new Date(startIso);
    const dEnd = new Date(endIso);

    const timeStart = new Intl.DateTimeFormat("en-GB", {
      timeZone: CAMPUS_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dStart);

    const timeEnd = new Intl.DateTimeFormat("en-GB", {
      timeZone: CAMPUS_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dEnd);

    return `${timeStart} – ${timeEnd}`;
  } catch {
    return `${startIso} – ${endIso}`;
  }
}

export function formatBookingCreatedDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: CAMPUS_TIME_ZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}
