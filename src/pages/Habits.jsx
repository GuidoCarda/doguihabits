import React, { useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import useHabitsStore, { useHabitsActions } from "../store/store";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";

import { AnimatePresence, motion } from "framer-motion";

const Habits = () => {
  const [isOpen, setIsOpen] = useState(false);
  const habits = useHabitsStore((state) => state.habits);

  const { sortHabits } = useHabitsActions();

  const handleSort = (e) => {
    const mode = e.target.id;
    sortHabits(mode);
  };

  const handleShowToggle = () => {
    setIsOpen((prev) => !prev);

    if (typeof window != "undefined" && window.document && isOpen) {
      document.body.style.overflow = "unset";
    } else if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  return (
    <div className=" text-neutral-100 min-h-screen">
      <Layout>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold">My Habits</h1>

          <button
            onClick={handleShowToggle}
            className="h-12 w-min px-6 bg-green-600 font-bold rounded-md"
          >
            {isOpen ? "close" : "new"}
          </button>
        </div>

        {habits.length > 1 && <HabitsSorting handleSort={handleSort} />}

        <AnimatePresence>
          {isOpen && (
            <Modal key={"new_habit_modal"} onClose={() => setIsOpen(false)} />
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2  lg:grid-cols-3 "
        >
          {habits.map((habit) => (
            <HabitsWeekView key={habit.id} habit={habit} />
          ))}
        </motion.div>
        {Boolean(!habits.length) && (
          <EmptyState onClick={() => handleShowToggle()} />
        )}
      </Layout>
    </div>
  );
};

const EmptyState = ({ onClick }) => {
  return (
    <div className=" mt-32 grid place-content-center justify-items-center gap-4">
      <div className="p-5 md:p-0 rounded-lg">
        <img className="h-full w-full" src="src/assets/EmptyState.png" alt="" />
      </div>
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
