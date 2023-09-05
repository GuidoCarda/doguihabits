import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  daysInMonth,
  getAllDaysInMonth,
  getTotal,
  isSameMonth,
  nextState,
  randomId,
  startOfDay,
} from "../utils";
import { toast } from "react-hot-toast";

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
  description: "",
  daysStateCount,
  currentStreak: 0,
  badges: [],
  months: [],
};

/**
 * Creates a new habit with the given input and adds it to the state.
 *
 * @param {Function} set - The set function from the Zustand store.
 * @param {Function} get - The get function from the Zustand store.
 * @param {Object} habitData - The new habit data.
 * @param {string} habitData.input - The habit title.
 * @param {string} habitData.description - The habit description.
 */
const createHabit = (set, get, habitData) => {
  const state = get();

  const { input, description } = habitData;

  const newHabit = {
    ...habit,
    id: randomId(),
    createdAt: new Date(),
    title: input,
    description,
    months: [
      generatePendingHabitEntries(
        getAllDaysInMonth(today.getFullYear(), today.getMonth())
      ),
    ],
  };

  set({ habits: [newHabit, ...state.habits] });
};

/**
 * Returns the current streak for a habit, based on the provided months array.
 * @param months - An array of month objects, each of which contains an array of day objects with state information.
 * @returns streak - The current streak for the habit.
 */
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

/**
 * Updates the state of a given day in a habit and updates the store state.
 *
 * @param {Function} set - The set function from the Zustand store.
 * @param {Function} get - The get function from the Zustand store.
 * @param habitId The ID of the habit to update.
 * @param dayId The ID of the day to update.
 */
const updateHabit = (set, get, habitId, dayId) => {
  const state = get();
  // Find the habit to update based on its ID
  const { months, daysStateCount, badges, ...rest } = state.habits.find(
    (habit) => habit.id === habitId
  );

  // Find the month that the dat belongs to
  const monthToUpdate = months.findIndex((month) =>
    isSameMonth(month[0].id, dayId)
  );

  // Update the state of the day within the apropiate month
  const updatedMonths = months.map((month, idx) => {
    if (idx === monthToUpdate) {
      return month.map((day) => {
        return day.id === dayId ? { ...day, state: nextState(day.state) } : day;
      });
    }
    return month;
  });

  // Update the count of completed & failed days for the habit
  const updatedDaysStateCount = {
    ...daysStateCount,
    completed: updatedMonths
      .map((month) => getTotal(month, "completed"))
      .reduce((sum, monthTotal) => sum + monthTotal, 0),
    failed: updatedMonths
      .map((month) => getTotal(month, "failed"))
      .reduce((sum, monthTotal) => sum + monthTotal, 0),
  };

  // Calculate current habit streak if any
  const currentStreak = getHabitStreak(updatedMonths);

  // Check for completion milestones
  const completionMilestones = get().completionMilestones;

  // Get new milestones badges if reached
  const newMilestones = completionMilestones.filter(
    (milestone) => milestone <= currentStreak && !badges.includes(milestone)
  );

  const updatedBadges = [...badges, ...newMilestones];

  if (newMilestones.length > 0) {
    // Show toast for last earned badge.
    toast(
      `Congratulations! You just completed a ${updatedBadges.at(
        -1
      )} days streak`,
      {
        duration: 2000,
        icon: "🎊",
      }
    );
  }

  // Create a new habit object with the updated state
  const updatedHabit = {
    ...rest,
    months: updatedMonths,
    daysStateCount: updatedDaysStateCount,
    badges: updatedBadges,
    currentStreak,
  };

  // Replace the old habit state with the updated one
  set({
    habits: state.habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    ),
  });
};

/**
 * Check and update the habits with the months that are missing in order to have an up-to-date record.
 * @param {Function} set - The set function from the Zustand store.
 * @param {Function} get - The get function from the Zustand store.
 * @param id - The id of the habit to delete
 */
const deleteHabit = (set, get, id) => {
  const state = get();
  set({ habits: state.habits.filter((habit) => habit.id !== id) });
};

const getNextMonth = (prevDate) => {
  const date = new Date(prevDate);
  date.setMonth(date.getMonth() + 1);
  const monthDates = getAllDaysInMonth(date.getFullYear(), date.getMonth());

  return generatePendingHabitEntries(monthDates);
};

/**
 *
 * @param {Date} currentDate the current date object
 * @param {Date} prevMonthAdded the last month added date object
 * @returns {Boolean} whether it should or shouldn't add the next month
 */
const shouldAddNextMonth = (currentDate, prevMonthAdded) => {
  const isYearBeforeCurrent =
    prevMonthAdded.getFullYear() < currentDate.getFullYear();
  const isMonthBeforeCurrent =
    prevMonthAdded.getFullYear() === currentDate.getFullYear() &&
    prevMonthAdded.getMonth() < currentDate.getMonth();
  return isYearBeforeCurrent || isMonthBeforeCurrent;
};

/**
 * Check and update the habits with the months that are missing in order to have an up-to-date record.
 *
 * @param {Function} set - The set function from the Zustand store.
 * @param {Function} get - The get function from the Zustand store.
 */
const checkAndUpdateHabits = (set, get) => {
  const state = get();
  const currentDate = startOfDay(new Date());

  const updatedHabits = state.habits.map((habit) => {
    const lastMonthRecordedDate = startOfDay(habit.months.at(-1)[0].id);
    const monthsToAdd = [];
    let prevMonthAdded = lastMonthRecordedDate;

    // console.log(habit.id);
    // if the habit contains the current month, return the same habit object
    if (isSameMonth(currentDate, prevMonthAdded)) {
      return habit;
    }

    // Calculate the months that are missing and add them to the habit object.
    while (shouldAddNextMonth(currentDate, prevMonthAdded)) {
      monthsToAdd.push(getNextMonth(prevMonthAdded));
      prevMonthAdded = new Date(
        prevMonthAdded.getFullYear(),
        prevMonthAdded.getMonth() + 1
      );
    }

    return { ...habit, months: [...habit.months, ...monthsToAdd] };
  });

  // Update the habits in the Zustand store.
  set({ habits: updatedHabits });
};

/**
 * Updates the values of a given habit on the store state.
 *
 * @param {Function} set - The set function from the Zustand store.
 * @param {Function} get - The get function from the Zustand store.
 * @param habitId The ID of the habit to update.
 * @param {Object} habitData The new data to edit the habit.
 * @param {string} habitData.input The habit edited title.
 * @param {string} habitData.description The habit edited description.
 */
const editHabit = (set, get, habitId, habitData) => {
  const state = get();

  const habit = state.habits.find((habit) => habit.id === habitId);
  if (!habit) return console.log("algo salio mal");

  const { input, description } = habitData;

  const editedHabit = { ...habit, title: input, description };
  const updatedHabits = state.habits.map((habit) =>
    habit.id === habitId ? editedHabit : habit
  );

  set({ habits: updatedHabits });
};

const useHabitsStore = create(
  persist(
    (set, get) => ({
      habits: [],
      completionMilestones: [7, 14, 21, 30, 60, 120, 365],
      actions: {
        createHabit: (habitData) => createHabit(set, get, habitData),
        updateHabit: (habitId, dayId) => updateHabit(set, get, habitId, dayId),
        editHabit: (habitId, habitData) =>
          editHabit(set, get, habitId, habitData),
        deleteHabit: (id) => deleteHabit(set, get, id),
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
