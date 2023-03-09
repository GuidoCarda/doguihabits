import { create } from "zustand";

const day = {
  id: 1,
  state: "pending" | "completed" | "failed",
};

const randomId = (length = 6) =>
  Math.random()
    .toString(16)
    .substring(2, length + 2);

const habit = {
  id: "asdasd",
  title: "nombre",
  days: Array(30)
    .fill({})
    .map((day, idx) => ({ id: idx, state: "pending" })),
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
}));

export default useHabitsStore;
