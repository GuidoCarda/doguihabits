import { create } from "zustand";
import { persist } from "zustand/middleware";
import { randomId } from "../utils";

const daysInMonth = () => {
  const date = new Date();
  //getMonth is 0 based
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return new Date(year, month, 0).getDate();
};

const day = {
  id: 1,
  state: "pending" | "completed" | "failed",
};

const habit = {
  id: "",
  title: "",
  days: Array(daysInMonth())
    .fill({})
    .map((_, idx) => ({ id: idx, state: "pending" })),
};

const useHabitsStore = create(
  persist(
    (set, get) => ({
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
      getHabit: (id) => get().habits.find((habit) => habit.id === id),
      updateHabit: (editedHabit) =>
        set(() => ({
          habits: get().habits.map((habit) => {
            return habit.id === editedHabit.id ? editedHabit : habit;
          }),
        })),
      deleteHabit: (id) => {
        const filteredHabits = get().habits.filter((habit) => habit.id !== id);

        return set(() => ({
          habits: filteredHabits,
        }));
      },
    }),
    { name: "habits", partialize: (state) => ({ habits: state.habits }) }
  )
);

export default useHabitsStore;
