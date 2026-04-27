const EST_OFFSET_MINUTES = -5 * 60;
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 18;

function toEst(date: Date): Date {
  return new Date(date.getTime() + EST_OFFSET_MINUTES * 60_000);
}

function fromEst(date: Date): Date {
  return new Date(date.getTime() - EST_OFFSET_MINUTES * 60_000);
}

function isWeekday(date: Date): boolean {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
}

function nextBusinessStart(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);
  while (!isWeekday(d) || d <= date) {
    d.setUTCDate(d.getUTCDate() + 1);
    d.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);
  }
  return d;
}

export function addBusinessHours(start: Date, hours: number): Date {
  let cursor = toEst(start);
  let remainingMinutes = hours * 60;

  while (remainingMinutes > 0) {
    if (!isWeekday(cursor)) {
      cursor = nextBusinessStart(cursor);
      continue;
    }

    const dayEnd = new Date(cursor);
    dayEnd.setUTCHours(BUSINESS_END_HOUR, 0, 0, 0);

    const dayStart = new Date(cursor);
    dayStart.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);

    if (cursor < dayStart) {
      cursor = dayStart;
    }

    if (cursor >= dayEnd) {
      cursor = nextBusinessStart(cursor);
      continue;
    }

    const minutesUntilEnd = (dayEnd.getTime() - cursor.getTime()) / 60_000;
    if (remainingMinutes <= minutesUntilEnd) {
      cursor = new Date(cursor.getTime() + remainingMinutes * 60_000);
      remainingMinutes = 0;
    } else {
      remainingMinutes -= minutesUntilEnd;
      cursor = nextBusinessStart(cursor);
    }
  }

  return fromEst(cursor);
}

export const FOLLOWUP_CADENCE_HOURS = {
  n1: 2,
  n2: 8,
  n3: 24,
} as const;
