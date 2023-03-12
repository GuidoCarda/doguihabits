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
  const { days, daysStateCount, ...rest } = habits.find(
    (habit) => habit.id === habitId
  );

  const updatedDays = days.map((day) =>
    day.id === dayId ? { ...day, state: nextState(day.state) } : day
  );

  const updatedDaysStateCount = {
    ...daysStateCount,
    completed: getTotal(updatedDays, "completed"),
    failed: getTotal(updatedDays, "failed"),
  };

  const updatedHabit = {
    ...rest,
    days: updatedDays,
    daysStateCount: updatedDaysStateCount,
  };

  return habits.map((habit) =>
    habit.id === updatedHabit.id ? updatedHabit : habit
  );
};

const deleteHabit = (habits, id) => habits.filter((habit) => habit.id !== id);

const getTotal = (array, state) => {
  return array.reduce((acum, currValue) => {
    if (currValue.state === state) {
      acum += 1;
    }
    return acum;
  }, 0);
};

const sortHabits = (habits, mode) => {
  if (!mode) return habits;

  let sortedHabits;

  if (mode === "older") {
    sortedHabits = [...habits].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  if (mode === "newest") {
    sortedHabits = [...habits].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  if (mode === "most-completed") {
    sortedHabits = [...habits].sort((a, b) => {
      return b.daysStateCount.completed - a.daysStateCount.completed;
    });
  }

  return sortedHabits;
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
        sortHabits: (mode) => {
          return set((state) => ({ habits: sortHabits(state.habits, mode) }));
        },
      },
    }),
    { name: "habits", partialize: (state) => ({ habits: state.habits }) }
  )
);

export const useHabitsActions = () => useHabitsStore((state) => state.actions);

export default useHabitsStore;
