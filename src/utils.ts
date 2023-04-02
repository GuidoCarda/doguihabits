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

export const getDayMonthYear = (date: string) => {
  const tempDate = new Date(date);

  const day = tempDate.getDate();
  const month = tempDate.getMonth() + 1;
  const year = tempDate.getFullYear();

  return [day, month, year];
};

export const getMonthString = (month: number): string => {
  return MONTHS[month];
};

export const getTotal = (array: any[], state: string): number => {
  return array.reduce((acum, currValue) => {
    if (currValue.state === state) {
      acum += 1;
    }
    return acum;
  }, 0);
};

export const startOfDay = (dirtyDate: Date | string): Date => {
  const date = new Date(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const isSameMonth = (dirtyDate: Date | string): boolean => {
  const date = new Date(dirtyDate);
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
};

export const isPast = (dirtyDateToCompare: Date | string): boolean => {
  const date = startOfDay(new Date());
  const dateToCompare = startOfDay(dirtyDateToCompare);

  return date.getTime() >= dateToCompare.getTime();
};
