import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAllDaysInMonth } from "../utils";
import { generatePendingHabitEntries2 } from "../store/useHabitsStore";

/**
 * Creates a new habit with entries and the formData.
 * @param {Object} formData - The new habit data.
 * @param {string} formData.input - The habit title.
 * @param {string} formData.description - The habit description.
 * @throws An error if something goes wrong in the creation proccess
 * @returns The id of the habit just created
 */
export const createHabit = async (formData) => {
  console.log("createHabit called", formData);
  const { input, description } = formData;

  try {
    const newHabit = {
      uid: auth?.currentUser?.uid,
      createdAt: new Date(),
      title: input,
      badges: [],
      currentStreak: 0,
      description: description ?? "",
    };

    const habitsCollection = collection(db, "habits");
    const habitRef = await addDoc(habitsCollection, newHabit);
    const habitId = habitRef.id;
    const entriesCollection = collection(habitsCollection, habitId, "entries");

    const entries = generatePendingHabitEntries2(
      getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth())
    );

    const entriesBatch = writeBatch(db);
    for (const entry of entries) {
      entriesBatch.set(doc(entriesCollection), entry);
    }
    await entriesBatch.commit();

    console.log(
      `habitID ${habitId} created, Entries added for the whole month`
    );

    return habitId;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Get all the habits with its entries
 * @throws An error if something goes wrong on the request
 * @returns The habits array with its corresponding entries
 */
export const getHabitsWithEntries = async () => {
  console.log("getHabitWithEntries called");
  try {
    const habitsCollection = collection(db, "habits");
    const habitsSnapshot = await getDocs(habitsCollection);

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
  console.log(habitId, entryId, state);
  try {
    console.log(habitId, entryId, state);
    const entriesCollection = collection(db, "habits", habitId, "entries");
    const entryRef = doc(entriesCollection, entryId);
    await updateDoc(entryRef, { state });
    console.log(`entry ${entryId} updated from habit ${habitId} updated `);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Delete a given habit by its ID.
 * @param id - The id of the habit to delete
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
