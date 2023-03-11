import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nextState, randomId } from "../utils";

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
      actions: {
        createHabit: () => {
          const newHabit = {
            ...habit,
            id: randomId(),
            title: get().input,
          };

          set(() => ({
            habits: [newHabit, ...get().habits],

            //clear input field
            input: "",
          }));
        },
        getHabit: (id) => get().habits.find((habit) => habit.id === id),
        updateHabit: (habitId, dayId) => {
          const habit = get().actions.getHabit(habitId);

          const editedHabit = {
            ...habit,
            days: habit.days.map((day) =>
              day.id === dayId ? { ...day, state: nextState(day.state) } : day
            ),
          };

          const updatedHabits = get().habits.map((habit) => {
            return habit.id === editedHabit.id ? editedHabit : habit;
          });

          return set(() => ({
            habits: updatedHabits,
          }));
        },
        deleteHabit: (id) => {
          const filteredHabits = get().habits.filter(
            (habit) => habit.id !== id
          );

          return set(() => ({
            habits: filteredHabits,
          }));
        },
      },
    }),
    { name: "habits", partialize: (state) => ({ habits: state.habits }) }
  )
);

export const useHabitsActions = () => useHabitsStore((state) => state.actions);

export default useHabitsStore;
