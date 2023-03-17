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
