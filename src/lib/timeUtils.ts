import { formatDistanceToNow, differenceInYears, parseISO } from 'date-fns';

export function formatLastLogin(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Never logged in";
  }

  const date = parseISO(dateString);
  const now = new Date();

  if (differenceInYears(now, date) >= 1) {
    return "Over a year ago";
  }

  return formatDistanceToNow(date, { addSuffix: true });
}