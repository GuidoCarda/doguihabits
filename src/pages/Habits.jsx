import React, { useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import useHabitsStore, { useHabitsActions } from "../store/store";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";

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
    <div className="bg-zinc-800 min-h-screen">
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

        {habits.length > 1 && <HabitsSorting handleSort={handleSort} />}

        <Modal open={showHabitForm} onClose={() => setShowHabitForm(false)} />

        <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-3 ">
          {habits.map((habit) => (
            <HabitsWeekView habit={habit} />
          ))}
        </div>
        {Boolean(!habits.length) && (
          <EmptyState onClick={() => handleShowToggle()} />
        )}
      </Layout>
    </div>
  );
};

const EmptyState = ({ onClick }) => {
  return (
    <div className="text-neutral-100 mt-20 grid place-content-center justify-items-center gap-4">
      <div className="h-40 w-40 bg-zinc-700 rounded-lg"></div>
      <h2 className="text-3xl text-bold">Start by creating an habit</h2>
      <button
        onClick={onClick}
        className="bg-green-500 w-max px-4 h-10 rounded-md font-bold"
      >
        create an habit
      </button>
    </div>
  );
};

export default Habits;
