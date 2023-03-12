import { create } from "zustand";
import { persist } from "zustand/middleware";
import { daysInMonth, nextState, randomId } from "../utils";

const day = {
  id: 1,
  state: "pending" | "completed" | "failed",
};

const daysStateCount = {
  completed: 0,
  failed: 0,
};

const habit = {
  id: "",
  title: "",
  createdAt: "",
  daysStateCount,
  days: Array(daysInMonth())
    .fill({})
    .map((_, idx) => ({ id: idx, state: "pending" })),
};

const createHabit = (input) => {
  const newHabit = {
    ...habit,
    id: randomId(),
    createdAt: new Date(),
    title: input,
  };

  return newHabit;
};

const updateHabit = (habits, habitId, dayId) => {
  const habit = habits.find((habit) => habit.id === habitId);

  console.log(habit);

  const editedHabit = {
    ...habit,
    days: habit.days.map((day) =>
      day.id === dayId ? { ...day, state: nextState(day.state) } : day
    ),
    daysStateCount: {
      ...habit.daysStateCount,
      completed: habit.daysStateCount.completed + 1,
    },
  };

  console.log(editedHabit);

  return habits.map((habit) =>
    habit.id === editedHabit.id ? editedHabit : habit
  );
};

const deleteHabit = (habits, id) => habits.filter((habit) => habit.id !== id);

const sortHabits = (habits) => {
  console.log(habits);

  console.log(
    habits[0].days.reduce((acum, currentValue) => {
      if (currentValue.state === "completed") {
        acum += 1;
      }
      return acum;
    }, 0)
  );

  // habits.map((habit) => {
  //   console.log(habit);
  //   console.log(
  //     habit.reduce((acum, currentValue) => {
  //       if (currentValue.state === "completed") {
  //         acum + 1;
  //       }
  //     }, 0)
  //   );
  //   return habit;
  // });

  // const sortedHabits = habits
  //   .map((h) => h)
  //   .sort((a, b) => {
  //     return new Date(a.createdAt) - new Date(b.createdAt);
  //   });

  // console.log(sortedHabits);

  return habits;
};

const useHabitsStore = create(
  persist(
    (set, get) => ({
      habits: [],
      input: "",
      setInput: (userInput) => set(() => ({ input: userInput })),
      actions: {
        createHabit: () => {
          set((state) => ({
            habits: [createHabit(state.input), ...state.habits],
            input: "",
          }));
        },
        getHabit: (id) => get().habits.find((habit) => habit.id === id),
        updateHabit: (habitId, dayId) => {
          return set((state) => ({
            habits: updateHabit(state.habits, habitId, dayId),
          }));
        },
        deleteHabit: (id) => {
          return set((state) => ({
            habits: deleteHabit(state.habits, id),
          }));
        },
        sortHabits: () => {
          return set((state) => ({ habits: sortHabits(state.habits) }));
        },
      },
    }),
    { name: "habits", partialize: (state) => ({ habits: state.habits }) }
  )
);

export const useHabitsActions = () => useHabitsStore((state) => state.actions);

export default useHabitsStore;
