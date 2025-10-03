// utils/dateUtils.ts
import { differenceInDays, differenceInMonths, differenceInYears, parseISO } from "date-fns";

export function formatAge(dob?: string | null): string {
  if (!dob) return "-"; // No DOB, return a fallback
  
  try {
    const birthDate = parseISO(dob);
    const now = new Date();

    const years = differenceInYears(now, birthDate);
    if (years > 0) return `${years} Years`;

    const months = differenceInMonths(now, birthDate);
    if (months > 0) return `${months} Months`;

    const days = differenceInDays(now, birthDate);
    if (days > 7) return `${Math.floor(days / 7)} Weeks`;

    return `${days} Days`;
  } catch {
    return "-"; // in case dob is invalid
  }
}
