import { format, isValid, parse } from 'date-fns';

/** Parse "HH:mm" and show 12-hour clock with AM/PM (e.g. 9:00 AM). */
export function formatTime24hTo12h(time24: string | null | undefined): string {
  const t = time24?.trim();
  if (!t) return '—';
  const d = parse(t, 'HH:mm', new Date(2000, 0, 1));
  if (!isValid(d)) return t;
  return format(d, 'h:mm a');
}
