import React, { useState } from "react";

//Components
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";

//Zustand Store
import { useHabits, useHabitsActions } from "../store/useHabitsStore";

//Hooks
import useMediaQuery from "../hooks/useMediaQuery";
import useKeyPress from "../hooks/useKeyPress";

//Animations
import { AnimatePresence, motion } from "framer-motion";

//Date Utils
import { isThisMonth } from "../utils";

//Icons
import { PlusIcon } from "@heroicons/react/24/outline";

const Habits = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("");

  //Get habits sorted by criteria if any, else get them in default order of creation
  const habits = useHabits(sortCriteria);
  const hasHabits = habits.length > 0;

  const { addHabitMonth } = useHabitsActions();

  const hasCurrentMonth = (habit) => isThisMonth(habit.months.at(-1)[0].id);

  //Add dinamicaly the corresponding months to each habit on load if any
  if (hasHabits) {
    if (!hasCurrentMonth(habits[0])) {
      for (let habit of habits) {
        addHabitMonth(habit.id);
      }
    }
  }

  const handleClose = () => setIsOpen(false);

  const handleShowToggle = () => {
    setIsOpen((prev) => !prev);

    // block page scroll when modal isOpen
    if (typeof window != "undefined" && window.document && isOpen) {
      document.body.style.overflow = "unset";
    } else if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  // KeysActions maps to provide the user keyboard shortcuts
  const keysToAction = [
    {
      keys: ["shiftKey", "n"],
      conditionals: [!isOpen],
      callback: (e) => {
        e.preventDefault();
        handleShowToggle();
      },
    },
    {
      keys: ["Escape"],
      conditionals: [isOpen],
      callback: handleShowToggle,
    },
    {
      keys: ["shiftKey", "b"],
      conditionals: [],
      callback: (e) => {
        console.log("wombo combo");
      },
    },
  ];

  useKeyPress(keysToAction);

  // update sorting criteria when user selects new option
  const handleSortChange = (event) => {
    const id = event.target.id;
    const newSortCriteria = id !== sortCriteria ? id : "";
    setSortCriteria(newSortCriteria);
  };

  //Conditionally style components and animations based on device
  const isMobile = useMediaQuery("(max-width: 638px)");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" text-neutral-100  max-h-screen overflow-auto scrollbar-none sm:scrollbar-thin sm:scrollbar-thumb-zinc-500 sm:scrollbar-thumb-rounded-xl"
    >
      <Layout>
        <PageHeader hasHabits={hasHabits} handleShowToggle={handleShowToggle} />

        {habits.length > 1 && (
          <HabitsSorting
            onClick={handleSortChange}
            sortCriteria={sortCriteria}
          />
        )}

        <AnimatePresence>
          {isOpen && (
            <Modal
              key={"new_habit_modal"}
              onClose={handleClose}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        {hasHabits && <HabitsGrid habits={habits} />}
        {!hasHabits && <EmptyState onClick={handleShowToggle} />}
      </Layout>
    </motion.div>
  );
};

const PageHeader = ({ hasHabits, handleShowToggle }) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-3xl font-semibold">My Habits</h1>

      {hasHabits && (
        <button
          onClick={handleShowToggle}
          className="h-10 px-4 bg-green-600 font-bold rounded-md"
        >
          <span className="hidden md:block">new habit</span>

          <PlusIcon className="h-6 w-6 font-bold md:hidden" strokeWidth="3" />
        </button>
      )}
    </div>
  );
};

const HabitsGrid = ({ habits }) => {
  return (
    <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 ">
      {habits.map((habit) => (
        <HabitsWeekView key={habit.id} habit={habit} />
      ))}
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
        <img className="h-full w-full" src="EmptyState.png" alt="" />
      </div>
      <h2 className="text-3xl text-bold">Start by creating a habit</h2>
      <button
        onClick={onClick}
        className="bg-green-600 w-max px-4 h-10 rounded-md font-bold cursor-pointer"
      >
        create an habit
      </button>

      <span className="hidden relative md:flex  items-center gap-1 text-xs text-zinc-500">
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
