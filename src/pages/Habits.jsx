import React, { useState } from "react";

//Components
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";

//Zustand Store
import useHabitsStore, { useHabitsActions } from "../store/useHabitsStore";

//Hooks
import useMediaQuery from "../hooks/useMediaQuery";

//Animations
import { AnimatePresence, motion } from "framer-motion";
import useKeyPress from "../hooks/useKeyPress";

const Habits = () => {
  const [isOpen, setIsOpen] = useState(false);

  const habits = useHabitsStore((state) => state.habits);
  const setInput = useHabitsStore((state) => state.setInput);

  const { sortHabits } = useHabitsActions();

  const handleClose = () => {
    setIsOpen(false);
    setInput("");
  };

  const onKeyPress = (event) => {
    event.preventDefault();
    if (event.shiftKey && event.key.toLowerCase() === "n") {
      setIsOpen(true);
    }

    if (event.key === "Escape") {
      handleClose();
    }
  };

  useKeyPress(["n", "Escape"], onKeyPress);

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

  const isMobile = useMediaQuery("(max-width: 638px)");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" text-neutral-100 h-screen overflow-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-xl"
    >
      <Layout>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold">My Habits</h1>

          {Boolean(habits.length) && (
            <button
              onClick={handleShowToggle}
              className="h-10 px-4 bg-green-600 font-bold rounded-md"
            >
              new habit
            </button>
          )}
        </div>

        {habits.length > 1 && <HabitsSorting handleSort={handleSort} />}

        <AnimatePresence>
          {isOpen && (
            <Modal
              key={"new_habit_modal"}
              onClose={handleClose}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 "
        >
          {habits.map((habit) => (
            <HabitsWeekView key={habit.id} habit={habit} />
          ))}
        </motion.div>
        {Boolean(!habits.length) && (
          <EmptyState onClick={() => handleShowToggle()} />
        )}
      </Layout>
    </motion.div>
  );
};

const EmptyState = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className=" mt-32 grid place-content-center justify-items-center gap-4"
    >
      <div className="p-5 md:p-0 rounded-lg">
        <img className="h-full w-full" src="src/assets/EmptyState.png" alt="" />
      </div>
      <h2 className="text-3xl text-bold">Start by creating a habit</h2>
      <button
        onClick={onClick}
        className="bg-green-600 w-max px-4 h-10 rounded-md font-bold cursor-pointer"
      >
        create an habit
      </button>

      <span className="relative flex  items-center gap-1 text-xs text-zinc-500">
        or press{" "}
        <kbd className="grid place-content-center px-2 h-6  rounded-sm bg-zinc-700 text-zinc-400">
          Shift
        </kbd>
        +
        <kbd className="grid place-content-center px-2 h-6  rounded-sm bg-zinc-700 text-zinc-400">
          n
        </kbd>
      </span>
    </motion.div>
  );
};

export default Habits;
