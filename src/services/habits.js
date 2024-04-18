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
import { isSameDay, nextState } from "../utils";

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
      entries: [],
    };

    const habitsCollection = collection(db, "habits");
    const habitRef = await addDoc(habitsCollection, newHabit);
    const habitId = habitRef.id;

    console.log(`habitID ${habitId} created`);

    return { id: habitId, ...newHabit };
  } catch (err) {
    console.error(err);
  }
};

/**
 * Create the entries for a given habit by its ID
 * @param {string} habitId
 * @param {object[]} entries
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
        entries: doc
          .data()
          .entries.map((entry) => ({
            ...entry,
            date: entry.date.toDate(),
          }))
          .sort((a, b) => b.date - a.date),
      });
    });

    return habits;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Restart a single habit progress. Currently entries & badges are restarted
 * @param {string} id
 * @returns null if everything goes well
 * @throws An error if something goes wrong in the restarting proccess
 */
export const restartHabitProgress = async (id) => {
  try {
    const habitsCollection = collection(db, "habits");
    const habitRef = doc(habitsCollection, id);

    await updateDoc(habitRef, { entries: [], badges: [] });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Restart all habits progress. Currently entries & badges are restarted
 * @param {string[]} habitIds - The id's of the habits to reset
 * @returns null if everything goes well
 * @throws An error if something goes wrong in the restarting proccess
 */
export const restartAllHabitProgress = async (habitIds) => {
  try {
    const habitsCollection = collection(db, "habits");
    const batch = writeBatch(db);

    for (const habitId of habitIds) {
      const habitRef = doc(habitsCollection, habitId);
      batch.update(habitRef, { entries: [], badges: [] });
    }

    await batch.commit();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get all the entries from a habit
 * @param {string} habitId - The id of the habit to query the entries from
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
 * @param {string} habitId - The id of the habit to get
 * @throws An error if the habit could not be found or something else went wrong
 * @returns The habit object
 */
export const getHabitById = async (habitId) => {
  try {
    const habitsCollection = collection(db, "habits");
    const habitRef = doc(habitsCollection, habitId);
    const habitSnapshot = await getDoc(habitRef);

    const habit = { ...habitSnapshot.data() };
    return habit;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Update a given habit entry by its ID.
 * @param {string} habitId - The id of the habit to update
 * @param {string} entryDate - The date of the entry to update
 * @param {object[]} entries - The entries array of that habit
 * @throws An error if the habit could not be updated
 */
export const updateHabitEntry = async (habitId, entryDate, entries) => {
  const updatedEntries = entries.map((entry) => {
    if (isSameDay(entry.date, entryDate)) {
      return {
        ...entry,
        state: nextState(entry.state),
      };
    }
    return entry;
  });

  try {
    const habitsCollection = collection(db, "habits");
    const habitRef = doc(habitsCollection, habitId);

    await updateDoc(habitRef, { entries: updatedEntries });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Add a new habit entry.
 * @param {string} habitId - The id of the habit to add the entry to
 * @param {object} entry - The entry to be added
 * @returns the added entry
 * @throws An error if the entry could not be added
 */
export const addEntry = async (habitId, entry) => {
  const habitsCollection = collection(db, "habits");
  const habitRef = doc(habitsCollection, habitId);

  await updateDoc(habitRef, {
    entries: arrayUnion(entry),
  });

  return entry;
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

/**
 * Edit habit document data
 * @param {string} habitId - The id of the habit to edit
 * @param {object} data - The data to update in the habit
 * @returns null if everithing goes well
 * @throws An error if the habit could not be updated
 */
export const editHabit = async (habitId, data) => {
  const habitsCollection = collection(db, "habits");
  const habitRef = doc(habitsCollection, habitId);

  await updateDoc(habitRef, data);

  return null;
};
