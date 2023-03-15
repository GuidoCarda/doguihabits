import React, { useState } from "react";
import useHabitsStore, { useHabitsActions } from "../store/store";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import HabitsSorting from "./components/HabitSorting";
import Habit from "./components/Habit";

const Habits = () => {
  const [showHabitForm, setShowHabitForm] = useState(false);

  const habits = useHabitsStore((state) => state.habits);

  const { sortHabits } = useHabitsActions();

  const handleSort = (e) => {
    const mode = e.target.id;
    sortHabits(mode);
  };

  const handleShowToggle = () => {
    setShowHabitForm((prev) => !prev);

    if (typeof window != "undefined" && window.document && showHabitForm) {
      document.body.style.overflow = "unset";
    } else if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  return (
    <main className="min-h-screen bg-zinc-800">
      <Layout>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold text-neutral-100">My Habits</h1>

          <button
            onClick={handleShowToggle}
            className="h-12 w-min px-6 bg-green-600 text-white font-bold rounded-md"
          >
            {showHabitForm ? "close" : "new"}
          </button>
        </div>

        <Modal open={showHabitForm} onClose={() => setShowHabitForm(false)} />

        {habits.length > 1 && <HabitsSorting handleSort={handleSort} />}

        <ul className="text-neutral-100 flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          {Boolean(habits.length) ? (
            habits.map((habit) => (
              <li key={habit.id}>
                <Habit habit={habit} />
              </li>
            ))
          ) : (
            <h1>No creaste un habito!</h1>
          )}
        </ul>
      </Layout>
    </main>
  );
};

export default Habits;
