export const randomId = (length: number = 6): string => {
  return Math.random()
    .toString(16)
    .substring(2, length + 2);
};
