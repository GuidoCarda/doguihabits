import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  daysInCurrentMonth,
  getAllDaysInMonth,
  getPast7Days,
  getTotal,
  isSameMonth,
  nextState,
  startOfDay,
} from "../utils";
import { toast } from "react-hot-toast";
import { getHabitsWithEntries, updateHabitEntry } from "../services/habits";
import { auth } from "../firebase";

const today = new Date();

export const generatePendingHabitEntries = (datesArray) => {
  return datesArray.map((date) => ({
    date,
    state: "pending",
  }));
};

const daysStateCount = {
  completed: 0,
  failed: 0,
};

const habit = {
  title: "",
  createdAt: "",
  description: "",
  daysStateCount,
  currentStreak: 0,
  badges: [],
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
const createHabit = async (set, get, habitData) => {
  const state = get();
  const { input, description } = habitData;

  const newHabit = {
    ...habit,
    uid: auth?.currentUser?.uid,
    createdAt: new Date(),
    title: input,
    description: "",
  };

  // const habitId = await createDocInFirebase(newHabit);
  // const entries = await getHabitEntries(habitId);

  set({ habits: [{ ...newHabit, id: habitId, entries }, ...state.habits] });
};

/**
 * Get all the habits of the current user.
 * @param {Function} set - The set function from the Zustand store.
 * @param {string} userid - The ID of the user to get the habits from.
 */
const getHabits = async (set, userId) => {
  const habits = await getHabitsWithEntries();
  set({ habits: habits });
};

/**
 * Returns the current streak for a habit, based on the provided months array.
 * @param entries - An array of entries containing the id, date and state.
 * @returns streak - The current streak for the habit.
 */
export const getHabitStreak = (entries) => {
  let streak = 0;

  const lastMonth = entries.at(-1).date;

  const reversedEntries = entries
    .flat()
    .reverse()
    .slice(daysInCurrentMonth(lastMonth) - today.getDate());

  for (let entry of reversedEntries) {
    if (entry.state !== "completed") {
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
const updateHabit = async (set, get, habitId, dayId) => {
  const state = get();

  // Find the habit to update based on its ID
  const { entries, daysStateCount, badges, ...rest } = state.habits.find(
    (habit) => habit.id === habitId
  );

  // find entry to update
  const entryToUpdate = entries.find((entry) => entry.id === dayId);

  // Update the entry state
  await updateHabitEntry(habitId, dayId, nextState(entryToUpdate.state));

  // Update the state of the day within the apropiate month
  const updatedEntries = entries.map((entry) => {
    return entry.id === dayId
      ? { ...entry, state: nextState(entry.state) }
      : entry;
  });

  // Update the count of completed & failed days for the habit
  const updatedDaysStateCount = {
    ...daysStateCount,
    completed: getTotal(updatedEntries, "completed"),
    failed: getTotal(updatedEntries, "failed"),
  };

  // Calculate current habit streak if any
  const currentStreak = getHabitStreak(updatedEntries);

  // Check for completion milestones
  const completionMilestones = get().completionMilestones;

  // Get new milestones badges if reached
  const newMilestones = completionMilestones.filter(
    (milestone) => milestone <= currentStreak && !badges.includes(milestone)
  );

  // Update badges
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
    entries: updatedEntries,
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
 * Check if the current streak is a new milestone and return the new milestones.
 * @param {Function} get - The get function from the Zustand store.
 * @param {number} currentStreak - The current streak of the habit.
 * @param {Array} badges - The badges of the habit.
 * @returns {Array} - The new milestones.
 * */
const checkForNewMilestones = (get, currentStreak, badges) => {
  const completionMilestones = get().completionMilestones;

  const newMilestones = completionMilestones.filter(
    (milestone) => milestone <= currentStreak && !badges.includes(milestone)
  );
  return newMilestones.length > 0 ? newMilestones : null;
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

export const getNextMonthPendingHabitEntries = (prevDate) => {
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
export const shouldAddNextMonth = (currentDate, prevMonthAdded) => {
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

export const getPast7DaysEntries = (entries, currentDate) => {
  const currentEntryIndex = entries.findIndex(
    (entry) => startOfDay(entry.date).getTime() === currentDate.getTime()
  );

  let lastWeek = entries.slice(
    currentEntryIndex + 1 - 7,
    currentEntryIndex + 1
  );

  if (currentEntryIndex < 7) {
    lastWeek = entries.slice(0, currentEntryIndex + 1);
  }

  if (lastWeek.length < 7) {
    //if the current habit does not have data for the previous month,
    //generate placeholder values.

    //get prev 7 days based on the first available date
    const previousPlaceholderDates = getPast7Days(new Date(lastWeek[0].date))
      .map((date) => ({ id: date, date, state: "pending" }))
      .sort((a, b) => a.id.getDate() - b.id.getDate())
      .slice(lastWeek.length);

    lastWeek = previousPlaceholderDates.concat(lastWeek);
  }

  return lastWeek;
};

const useHabitsStore = create(
  persist(
    (set, get) => ({
      habits: [],
      completionMilestones: [7, 14, 21, 30, 60, 120, 365],
      actions: {
        getHabits: (userId) => getHabits(set, userId),
        createHabit: (habitData) => createHabit(set, get, habitData),
        updateHabit: (habitId, dayId) => updateHabit(set, get, habitId, dayId),
        editHabit: (habitId, habitData) =>
          editHabit(set, get, habitId, habitData),
        deleteHabit: (id) => deleteHabit(set, get, id),
        checkAndUpdateHabits: () => checkAndUpdateHabits(set, get),
        checkForNewMilestones: (currentStreak, badges) =>
          checkForNewMilestones(get, currentStreak, badges),
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
