import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  daysInMonth,
  getTotal,
  isSameMonth,
  nextState,
  randomId,
  startOfDay,
} from "../utils";

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
  currentStreak: 0,
  months: [],
};

const test = new Date(2022, 5, 12);

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

const getHabitStreak = (months) => {
  let streak = 0;

  const lastMonth = months.at(-1)[0].id;

  const days = months
    .flat()
    .reverse()
    .slice(daysInMonth(lastMonth) - today.getDate());

  for (let day of days) {
    if (day.state !== "completed") {
      break;
    }
    streak += 1;
  }
  return streak;
};

const updateHabit = (habits, habitId, dayId) => {
  const { months, daysStateCount, ...rest } = habits.find(
    (habit) => habit.id === habitId
  );

  const monthToUpdate = months.findIndex((month) =>
    isSameMonth(month[0].id, dayId)
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

  const currentStreak = getHabitStreak(updatedMonths);

  const updatedHabit = {
    ...rest,
    months: updatedMonths,
    daysStateCount: updatedDaysStateCount,
    currentStreak,
  };

  return habits.map((habit) =>
    habit.id === updatedHabit.id ? updatedHabit : habit
  );
};

const deleteHabit = (habits, id) => habits.filter((habit) => habit.id !== id);

const sortHabits = (habits, mode) => {
  if (mode === "older") {
    return [...habits].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  if (mode === "most-completed") {
    return [...habits].sort((a, b) => {
      return b.daysStateCount.completed - a.daysStateCount.completed;
    });
  }

  return [...habits].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

const getNextMonth = (prevDate) => {
  const date = new Date(prevDate);
  date.setMonth(date.getMonth() + 1);
  const monthDates = getAllDaysInMonth(date.getFullYear(), date.getMonth());

  return generatePendingHabitEntries(monthDates);
};

const addNextMonthToHabit = (habits, id) => {
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

const checkAndUpdateHabits = (set, get) => {
  const state = get();
  const currentDate = startOfDay(new Date());

  const updatedHabits = state.habits.map((habit) => {
    const lastMothRecordedDate = startOfDay(habit.months.at(-1)[0].id);
    const monthsToAdd = [];
    let prevMonthAdded = lastMothRecordedDate;

    console.log(habit.id);
    //Early return if the habit contains the current month
    if (isSameMonth(currentDate, prevMonthAdded)) {
      // console.log("Had current month");
      return habit;
    }
    console.log("didn\t had current month");

    while (
      prevMonthAdded.getFullYear() < currentDate.getFullYear() ||
      (prevMonthAdded.getFullYear() === currentDate.getFullYear() &&
        prevMonthAdded.getMonth() < currentDate.getMonth())
    ) {
      // nextMonthDate = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1)
      monthsToAdd.push(getNextMonth(prevMonthAdded));
      prevMonthAdded = new Date(
        prevMonthAdded.getFullYear(),
        prevMonthAdded.getMonth() + 1
      );
    }
    return { ...habit, months: [...habit.months, ...monthsToAdd] };
  });

  set({ habits: updatedHabits });
};

const useHabitsStore = create(
  persist(
    (set, get) => ({
      habits: [],
      actions: {
        createHabit: (input) => {
          set((state) => ({
            habits: [createHabit(input), ...state.habits],
          }));
        },
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
        addNextMonthToHabit: (id) => {
          return set((state) => ({
            habits: addNextMonthToHabit(state.habits, id),
          }));
        },
        checkAndUpdateHabits: () => checkAndUpdateHabits(set, get),
        deleteAllHabits: () => set({ habits: [] }),
      },
    }),
    { name: "habits", partialize: (state) => ({ habits: state.habits }) }
  )
);

export const useHabitsActions = () => useHabitsStore((state) => state.actions);

const sortFunctions = {
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  completed: (a, b) => b.daysStateCount.completed - a.daysStateCount.completed,
};

// Get all habits based on sortCriteria, if any
export const useHabits = (sortCriteria) =>
  useHabitsStore((state) => {
    // the in checks if a property exists in an object
    // if the sortCriteria exists then the received criteria will be applied
    if (sortCriteria in sortFunctions) {
      return [...state.habits].sort(sortFunctions[sortCriteria]);
    }
    return state.habits;
  });

// Get a single habit by Id
export const useHabit = (id) =>
  useHabitsStore((state) => state.habits.find((habit) => habit.id === id));

export default useHabitsStore;
