const MONTHS = [
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

const WEEK_DAYS = [
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

export const daysInMonth = (): number => {
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

export const getDayMonthYear = (dirtyDate: string) => {
  const date = new Date(dirtyDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return [day, month, year];
};

export const getMonthString = (month: number): string => {
  return MONTHS[month];
};

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

export const startOfDay = (dirtyDate: Date | string | number): Date => {
  const date = new Date(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
};

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

export const isThisMonth = (dirtyDate: Date | string): boolean => {
  return isSameMonth(Date.now(), dirtyDate);
};

export const getDaysInMonth = (dirtyDate: Date | string): number => {
  const date = new Date(dirtyDate);
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month, 0).getDate();
};

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

export const isSameDay = (
  dirtyDateLeft: Date | string | number,
  dirtyDateRight: Date | string | number
): boolean => {
  const leftDate = startOfDay(dirtyDateLeft);
  const rightDate = startOfDay(dirtyDateRight);
  return leftDate.getTime() === rightDate.getTime();
};

export const isToday = (dirtyDate: Date | string): boolean => {
  return isSameDay(dirtyDate, Date.now());
};
