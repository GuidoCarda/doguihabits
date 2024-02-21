import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  generatePendingHabitEntries,
  getAllDaysInMonth,
  getNextMonthPendingHabitEntries,
  isSameMonth,
  shouldAddNextMonth,
  startOfDay,
} from "../utils";

/**
 * Creates a new habit with entries and the formData.
 * @param {Object} formData - The new habit data.
 * @param {string} formData.input - The habit title.
 * @param {string} formData.description - The habit description.
 * @throws An error if something goes wrong in the creation proccess
 * @returns The id of the habit just created
 */
export const createHabit = async (formData) => {
  const { title, description } = formData;
  const date = new Date();

  try {
    const newHabit = {
      uid: auth?.currentUser?.uid,
      createdAt: date,
      title,
      badges: [],
      currentStreak: 0,
      description: description ?? "",
    };

    const habitsCollection = collection(db, "habits");
    const habitRef = await addDoc(habitsCollection, newHabit);
    const habitId = habitRef.id;
    const entriesCollection = collection(habitsCollection, habitId, "entries");

    const entries = generatePendingHabitEntries(
      getAllDaysInMonth(date.getFullYear(), date.getMonth())
    );

    const entriesBatch = writeBatch(db);
    for (const entry of entries) {
      entriesBatch.set(doc(entriesCollection), entry);
    }
    await entriesBatch.commit();

    console.log(
      `habitID ${habitId} created, Entries added for the whole month`
    );

    return { id: habitId, ...newHabit, entries };
  } catch (err) {
    console.error(err);
  }
};
/**
 * Create the entries for a given habit by its ID
 * @param {string} habitId
 * @param {Array} entries
 * @returns null if everything goes well
 * @throws An error if something goes wrong in the creation proccess
 */
export const createHabitEntries = async (habitId, entries) => {
  try {
    const habitsCollection = collection(db, "habits");
    const entriesCollection = collection(habitsCollection, habitId, "entries");

    const entriesBatch = writeBatch(db);
    for (const entry of entries) {
      entriesBatch.set(doc(entriesCollection), entry);
    }
    await entriesBatch.commit();

    console.log(
      `Entries created for habitID ${habitId}. Month added: ${new Date().getMonth()}`
    );

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get an Array of habits ids a user has
 * @param {string} userId - The id of the user to get the habits from
 * @returns An array of habit ids.
 */
export const getHabitsIds = async (userId) => {
  try {
    const habitsCollection = collection(db, "habits");
    const habitsQuery = query(habitsCollection, where("uid", "==", userId));
    const habitsSnapshot = await getDocs(habitsQuery);

    return habitsSnapshot.map((doc) => doc.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get all the habits with its entries
 * @throws An error if something goes wrong on the request
 * @returns The habits array with its corresponding entries
 */
export const getHabitsWithEntries = async (userId) => {
  console.log("getHabitWithEntries called");
  try {
    const habitsCollection = collection(db, "habits");
    const habitsQuery = query(habitsCollection, where("uid", "==", userId));
    const habitsSnapshot = await getDocs(habitsQuery);

    const habits = [];
    habitsSnapshot.forEach((doc) => {
      habits.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      });
    });

    for (const habit of habits) {
      const entries = await getHabitEntries(habit.id);
      habit.entries = entries;
    }

    await checkAndUpdateHabits(habits);

    return habits;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get all the entries from a habit
 * @param habitId - The id of the habit to query the entries from
 * @throws An error if something goes wrong with the request
 * @returns The entries array for corresponding the habitId
 */
export const getHabitEntries = async (habitId) => {
  console.log("getHabitEntries called");
  try {
    const entriesCollection = collection(db, "habits", habitId, "entries");
    const entriesQuery = query(entriesCollection, orderBy("date", "asc"));
    const entriesSnapshot = await getDocs(entriesQuery);

    const entries = [];

    entriesSnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      });
    });

    return entries;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Get a given habit by its ID.
 * @param habitId - The id of the habit to get
 * @throws An error if the habit could not be found or something else went wrong
 * @returns The habit object
 */
export const getHabitById = async (habitId) => {
  try {
    const habitsCollection = collection(db, "habits");
    const habitRef = doc(habitsCollection, habitId);
    const habitSnapshot = await getDoc(habitRef);

    const entries = await getHabitEntries(habitId);

    const habit = { ...habitSnapshot.data(), entries };
    return habit;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Update a given habit entry by its ID.
 * @param {string} habitId - The id of the habit to update
 * @param {string} entryId - The id of the entry to update
 * @param {string} state - The new state of the entry
 * @throws An error if the habit could not be updated
 */
export const updateHabitEntry = async (habitId, entryId, state) => {
  try {
    const entriesCollection = collection(db, "habits", habitId, "entries");
    const entryRef = doc(entriesCollection, entryId);
    await updateDoc(entryRef, { state });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Delete a given habit by its ID.
 * @param {string} id - The id of the habit to delete
 */
export const deleteHabit = async (id) => {
  try {
    const habitRef = doc(collection(db, "habits"), id);

    const entriesCollectionRef = collection(habitRef, "entries");
    const entriesQuerySnapshot = await getDocs(entriesCollectionRef);

    // Use a batched write to delete all entries in one request
    const batch = writeBatch(db);

    entriesQuerySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`entries deleted for habit ${id}`);

    await deleteDoc(habitRef);

    console.log(`habit ${id} deleted`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Delete all habits by its IDs
 * @param {string[]} habitsIds - The ids of the habits to delete
 */
export const deleteAllHabits = async (habitsIds) => {
  try {
    for (const habit of habitsIds) {
      await deleteHabit(habit);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkAndUpdateHabits = async (habits) => {
  const currentDate = startOfDay(new Date());

  for (const habit of habits) {
    // I purposelly chose the -7nth entry because a weird behaviour with js
    // dates that happens when you add a month to a date and its on the 31th day
    // in some cases js will return a date 2 months later.
    // -> https://stackoverflow.com/a/56388408
    const lastMonthRecordedDate = startOfDay(habit.entries.at(-7).date);
    const monthsToAdd = [];
    let prevMonthAdded = lastMonthRecordedDate;

    // if the habit contains the current month, returns
    if (isSameMonth(currentDate, prevMonthAdded)) {
      return;
    }

    // Calculate the months that are missing and add them to the habit object.
    while (shouldAddNextMonth(currentDate, prevMonthAdded)) {
      monthsToAdd.push(getNextMonthPendingHabitEntries(prevMonthAdded));
      prevMonthAdded = new Date(
        prevMonthAdded.getFullYear(),
        prevMonthAdded.getMonth() + 1
      );
    }

    await createHabitEntries(habit.id, monthsToAdd.flat());
  }

  return;
};

/**
 * Add completion badge to habit document
 * @param {string} habitId - The id of the habit to add the badge
 * @param {number} badges - The badges to add
 * @returns The added badgess
 * @throws An error if the badge/s could not be added
 */
export const addBadges = async (habitId, badges) => {
  console.log("addBadges called");
  console.log(habitId, badges);
  const habitsCollection = collection(db, "habits");
  const habitRef = doc(habitsCollection, habitId);

  await updateDoc(habitRef, {
    badges: arrayUnion(...badges),
  });
  return badges;
};

export const editHabit = async (habitId, data) => {
  const habitsCollection = collection(db, "habits");
  const habitRef = doc(habitsCollection, habitId);

  await updateDoc(habitRef, data);

  return null;
};
