/**
 * Hourly arrival windows for booking (stored as HH:mm in the API).
 * Covers midnight–11 PM so customers can pick evening and overnight start times.
 */
export const BOOKING_TIME_SLOTS_24H = Array.from({ length: 24 }, (_, h) =>
  `${String(h).padStart(2, '0')}:00`
);
