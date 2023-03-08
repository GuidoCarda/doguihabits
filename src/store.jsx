import { create } from "zustand";

const day = {
  id: 1,
  state: "pending",
};

const habit = {
  id: "",
  title: "",
  days: Array(30)
    .fill("")
    .map((_, idx) => ({ id: idx, state: "pending" })),
};

const useHabitsStore = create((set, get) => ({
  habits: [],
  input: "",
  setInput: (userInput) => set(() => ({ input: userInput })),
  createHabit: () =>
    set(() => ({
      habits: [
        ...get().habits,
        { ...habit, id: randomId(), title: get().input },
      ],
      input: "",
    })),
  updateHabit: () => set(() => ({})),
}));

export default useHabitsStore;

const randomId = (length = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};
