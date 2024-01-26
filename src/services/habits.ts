import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAllDaysInMonth } from "../utils";
import { generatePendingHabitEntries2 } from "../store/useHabitsStore";

export const createDocInFirebase = async (habit) => {
  try {
    const habitsCollection = collection(db, "habits");
    const habitRef = await addDoc(habitsCollection, habit);
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

// when using setDoc you have to specify the document id
// otherwise you can use addDoc which will generate a random id for you

export const getHabitsWithEntries = async () => {
  try {
    const habitsCollection = collection(db, "habits");
    const habitsSnapshot = await getDocs(habitsCollection);

    const habits = [] as any[];
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

export const getHabitEntries = async (habitId: string) => {
  try {
    const entriesCollection = collection(db, "habits", habitId, "entries");
    const entriesQuery = query(entriesCollection, orderBy("date", "asc"));
    const entriesSnapshot = await getDocs(entriesQuery);

    const entries = [] as any[];

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

export const updateHabitEntry = async (
  habitId: string,
  entryId: string,
  state: string
) => {
  console.log(habitId, entryId, state);
  try {
    const entriesCollection = collection(db, "habits", habitId, "entries");
    const entryRef = doc(entriesCollection, entryId);
    await updateDoc(entryRef, { state });
    console.log(`entry ${entryId} updated from habit ${habitId} updated `);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
