import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ENTRY_STATE, HABIT_MILESTONES } from "./constants";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const randomId = (length: number = 6): string => {
  return Math.random()
    .toString(16)
    .substring(2, length + 2);
};

export const daysInCurrentMonth = (): number => {
  const date = new Date();
  //getMonth is 0 based
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return new Date(year, month, 0).getDate();
};

export const nextState = (state: string): string => {
  if (state === "pending") return "completed";
  if (state === "completed") return "failed";
  return "pending";
};

// Returns an array containing the day, month year extracted from the given date
export const getDayMonthYear = (dirtyDate: string) => {
  const date = new Date(dirtyDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return [day, month, year];
};

export const getAllDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const dates: Date[] = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

// Get the month string based on dayIdx received from the date.getMonth() method (0-11)
export const getMonthString = (month: number): string => {
  return MONTHS[month];
};

// Get the weekday string based on dayIdx received from the date.getDay() method (0-6)
export const getWeekDayString = (dayIdx: number): string => {
  return WEEK_DAYS[dayIdx];
};

export const getTotal = (array: any[], state: string): number => {
  return array.reduce((acum, currValue) => {
    if (currValue.state === state) {
      acum += 1;
    }
    return acum;
  }, 0);
};

// returns a date with the timestamp set to the start of the day
export const startOfDay = (dirtyDate: Date | string | number): Date => {
  const date = new Date(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
};

// returns a date with the first date of the month
export const startOfMonth = (dirtyDate: Date | string | number) => {
  const date = startOfDay(dirtyDate);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// get the first date for each month in the range
export const getMonthDatesInRange = (
  dirtyStartDate: Date | string,
  dirtyEndDate: Date | string
) => {
  const startDate = startOfDay(dirtyStartDate);
  const endDate = startOfDay(dirtyEndDate);

  const dates = [] as Date[];

  while (
    startDate.getFullYear() < endDate.getFullYear() ||
    (startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() <= endDate.getMonth())
  ) {
    dates.push(startOfMonth(startDate));
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return dates;
};

// Check if the received dates are in the same month & year
export const isSameMonth = (
  dirtyDateLeft: Date | string | number,
  dirtyDateRight: Date | string | number
): boolean => {
  const dateLeft = startOfDay(dirtyDateLeft);
  const dateRight = startOfDay(dirtyDateRight);

  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth()
  );
};

//Check if the given date is on the current month
export const isThisMonth = (dirtyDate: Date | string): boolean => {
  return isSameMonth(Date.now(), dirtyDate);
};

// get the month total days count
export const getDaysInMonth = (dirtyDate: Date | string): number => {
  const date = new Date(dirtyDate);
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month, 0).getDate();
};

//Check if a given date is before the current date.
export const isPast = (dirtyDateToCompare: Date | string): boolean => {
  const date = startOfDay(new Date());
  const dateToCompare = startOfDay(dirtyDateToCompare);

  return date.getTime() >= dateToCompare.getTime();
};

export const getPast7Days = (initialDate = new Date()) => {
  const past7Days = [...Array(7).keys()];

  return past7Days.map((index) => {
    const date = new Date(initialDate);
    date.setDate(date.getDate() - index);
    return date;
  });
};

//Check based on two dates if they're the same day
export const isSameDay = (
  dirtyDateLeft: Date | string | number,
  dirtyDateRight: Date | string | number
): boolean => {
  const leftDate = startOfDay(dirtyDateLeft);
  const rightDate = startOfDay(dirtyDateRight);
  return leftDate.getTime() === rightDate.getTime();
};

//Check based on a date if it is the current day
export const isToday = (dirtyDate: Date | string): boolean => {
  return isSameDay(dirtyDate, Date.now());
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the current streak for a habit, based on the provided months array.
 * @param entries - An array of entries containing the id, date and state.
 * @returns streak - The current streak for the habit.
 */
export const getHabitStreak = (entries: Record<string, any>[]) => {
  let streak = 0;

  if (entries.length === 0) {
    return streak;
  }

  const sortedEntries = entries.slice().sort((a, b) => b.date - a.date);
  for (let i = 0; i < sortedEntries.length; i++) {
    const currentEntry = sortedEntries[i];

    if (
      (i === 0 && !isToday(currentEntry.date)) ||
      currentEntry.state !== ENTRY_STATE.completed
    ) {
      break;
    }

    if (i > 0) {
      const prevEntry = sortedEntries[i - 1];
      if (
        !isPreviousDay(
          startOfDay(prevEntry.date),
          startOfDay(currentEntry.date)
        )
      ) {
        break;
      }
    }

    streak += 1;
  }

  return streak;
};

/**
 * Check if a date is the previous day of another date.
 * @param prevDate
 * @param currentDate
 * @returns Boolean
 */
export const isPreviousDay = (prevDate, currentDate) => {
  return Math.abs(currentDate.getTime() - prevDate.getTime()) <= 86400000;
};

export const generatePendingHabitEntries = (datesArray) => {
  return datesArray.map((date) => ({
    date,
    state: ENTRY_STATE.pending,
  }));
};

export const getNextMonthPendingHabitEntries = (prevDate) => {
  const date = new Date(prevDate);
  date.setMonth(date.getMonth() + 1);
  const monthDates = getAllDaysInMonth(date.getFullYear(), date.getMonth());

  return generatePendingHabitEntries(monthDates);
};

/**
 *
 * @param {Date} currentDate the current date object
 * @param {Date} prevMonthAdded the last month added date object
 * @returns {Boolean} whether it should or shouldn't add the next month
 */
export const shouldAddNextMonth = (currentDate, prevMonthAdded) => {
  const isYearBeforeCurrent =
    prevMonthAdded.getFullYear() < currentDate.getFullYear();
  const isMonthBeforeCurrent =
    prevMonthAdded.getFullYear() === currentDate.getFullYear() &&
    prevMonthAdded.getMonth() < currentDate.getMonth();
  return isYearBeforeCurrent || isMonthBeforeCurrent;
};

/**
 * Check if the current streak reached a milestone/s and return the new milestones.
 * @param {number} currentStreak - The current streak of the habit.
 * @param {Array} badges - The badges of the habit.
 * @returns {Array} - The new milestones.
 * */
export const checkForNewMilestones = (
  currentStreak: number,
  badges: number[]
) => {
  const newMilestones = HABIT_MILESTONES.filter(
    (milestone) => milestone <= currentStreak && !badges.includes(milestone)
  );
  return newMilestones.length > 0 ? newMilestones : null;
};

export const getPast7DaysEntries = (entries, currentDate) => {
  const currentEntryIndex = entries.findIndex(
    (entry) => startOfDay(entry.date).getTime() === currentDate.getTime()
  );

  let lastWeek = entries.slice(
    currentEntryIndex + 1 - 7,
    currentEntryIndex + 1
  );

  if (currentEntryIndex < 7) {
    lastWeek = entries.slice(0, currentEntryIndex + 1);
  }

  if (lastWeek.length < 7) {
    //if the current habit does not have data for the previous month,
    //generate placeholder values.

    //get prev 7 days based on the first available date
    const previousPlaceholderDates = getPast7Days(new Date(lastWeek[0].date))
      .map((date) => ({ id: date, date, state: "pending" }))
      .sort((a, b) => a.id.getDate() - b.id.getDate())
      .slice(lastWeek.length);

    lastWeek = previousPlaceholderDates.concat(lastWeek);
  }

  return lastWeek;
};

/*
  Bear in mind the following special cases when using the new Date api
  https://stackoverflow.com/a/31732581
*/
export const getDatesInRange = (
  dirtyDateStart: Date | string | number,
  dirtyDateEnd: Date | string | number
) => {
  const dateStart = new Date(dirtyDateStart);
  const dateEnd = new Date(dirtyDateEnd);

  const dates = [] as Date[];

  while (dateStart <= dateEnd) {
    dates.push(new Date(dateStart));
    dateStart.setDate(dateStart.getDate() + 1);
  }

  return dates;
};

export const getFirstDayOfMonth = (dirtyDate: Date | string | number) => {
  const date = new Date(dirtyDate);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMonth = (dirtyDate: Date | string | number) => {
  const date = new Date(dirtyDate);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getMonthsDifference = (
  dirtyDateLeft: Date | string | number,
  dirtyDateRight: Date | string | number
) => {
  const leftDate = startOfDay(dirtyDateLeft);
  const rightDate = startOfDay(dirtyDateRight);

  return (
    rightDate.getMonth() -
    leftDate.getMonth() +
    12 * (rightDate.getFullYear() - leftDate.getFullYear()) +
    1
  );
};

export const getPrevMonthPlaceholderDates = (
  monthDate: Date,
  length: number
) => {
  const prevMonthLastDate = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    0
  );

  const dates = [] as Date[];

  while (dates.length < length) {
    dates.push(new Date(prevMonthLastDate));
    prevMonthLastDate.setDate(prevMonthLastDate.getDate() - 1);
  }

  return dates;
};
