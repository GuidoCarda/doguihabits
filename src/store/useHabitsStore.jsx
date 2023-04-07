import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTotal, nextState, randomId } from "../utils";

const getAllDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

const getDaysInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime());
  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

const today = new Date();

const generatePendingHabitEntries = (datesArray) => {
  return datesArray.map((date) => ({
    id: date,
    state: "pending",
  }));
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
  months: [],
};

const createHabit = (input) => {
  const newHabit = {
    ...habit,
    id: randomId(),
    createdAt: new Date(),
    title: input,
    months: [
      generatePendingHabitEntries(
        getAllDaysInMonth(today.getFullYear(), today.getMonth())
      ),
    ],
  };

  return newHabit;
};

const updateHabit = (habits, habitId, dayId) => {
  const { months, daysStateCount, ...rest } = habits.find(
    (habit) => habit.id === habitId
  );

  const monthToUpdate = months.findIndex(
    (month) => new Date(month[0].id).getMonth() === new Date(dayId).getMonth()
  );

  const updatedMonths = months.map((month, idx) => {
    if (idx === monthToUpdate) {
      return month.map((day) => {
        return day.id === dayId ? { ...day, state: nextState(day.state) } : day;
      });
    }
    return month;
  });

  const updatedDaysStateCount = {
    ...daysStateCount,
    completed: updatedMonths
      .map((month) => getTotal(month, "completed"))
      .reduce((sum, monthTotal) => sum + monthTotal, 0),
    failed: updatedMonths
      .map((month) => getTotal(month, "failed"))
      .reduce((sum, monthTotal) => sum + monthTotal, 0),
  };

  const updatedHabit = {
    ...rest,
    months: updatedMonths,
    daysStateCount: updatedDaysStateCount,
  };

  return habits.map((habit) =>
    habit.id === updatedHabit.id ? updatedHabit : habit
  );
};

const deleteHabit = (habits, id) => habits.filter((habit) => habit.id !== id);

const sortHabits = (habits, mode) => {
  if (!mode) return habits;

  let sortedHabits;

  if (mode === "older") {
    sortedHabits = [...habits].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  if (mode === "newer") {
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

const getNextMonth = (prevDate) => {
  const date = new Date(prevDate);
  date.setMonth(date.getMonth() + 1);
  const monthDates = getAllDaysInMonth(date.getFullYear(), date.getMonth());

  return generatePendingHabitEntries(monthDates);
};

const addHabitMonth = (habits, id) => {
  return habits.map((habit) => {
    if (habit.id === id) {
      const prevMonthDate = habit.months.at(-1)[0].id;

      return {
        ...habit,
        months: [...habit.months, getNextMonth(prevMonthDate)],
      };
    }
    return habit;
  });
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
        addHabitMonth: (id) => {
          return set((state) => ({ habits: addHabitMonth(state.habits, id) }));
        },
      },
    }),
    { name: "habits", partialize: (state) => ({ habits: state.habits }) }
  )
);

export const useHabitsActions = () => useHabitsStore((state) => state.actions);

export default useHabitsStore;
