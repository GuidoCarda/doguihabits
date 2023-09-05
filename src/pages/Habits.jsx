import React, { useEffect, useRef, useState } from "react";

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

//Icons
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, IconTextButton } from "../components/Buttons";
import { useDialog } from "../store/useDialogStore";
import { toast } from "react-hot-toast";
import HabitForm from "./components/HabitForm";
import { addDocTry } from "../firebase";

const Habits = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("");

  //Get habits sorted by criteria if any, else get them in default order of creation
  const habits = useHabits(sortCriteria);
  const hasHabits = habits.length > 0;

  // This ref prevents loosing the habitsCount value on re-render to
  // ensure only executing the checkAndUpdateHabits fn only when
  // a habit is created
  const habitsCountRef = useRef(habits.length);

  const { checkAndUpdateHabits } = useHabitsActions();

  //Runs when the component mounts and checks whether the habits have or not the needed data
  useEffect(() => {
    console.log("Page mount, checkAndUpdateHabits runs");
    checkAndUpdateHabits();
  }, []);

  //Runs each time a habit is added only
  useEffect(() => {
    if (habits.length > habitsCountRef.current) {
      console.log("habit added, so checkAndUpdateHabits runs");
      checkAndUpdateHabits();
    }
    habitsCountRef.current = habits.length;
  }, [habits.length]);

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

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={"habits_page"}
      className=" text-neutral-100 max-h-screen overflow-auto scrollbar-none sm:scrollbar-thin sm:scrollbar-thumb-zinc-500 sm:scrollbar-thumb-rounded-xl"
    >
      <Layout>
        <PageHeader hasHabits={hasHabits} handleShowToggle={handleShowToggle} />

        {habits.length > 1 && (
          <HabitsSorting
            onClick={handleSortChange}
            sortCriteria={sortCriteria}
          />
        )}

        <AnimatePresence mode="wait" initial={false}>
          {isOpen && (
            <Modal
              key={"new_habit_modal"}
              title="New Habit"
              onClose={handleClose}
            >
              <HabitForm onClose={handleClose} />
            </Modal>
          )}
        </AnimatePresence>

        {hasHabits && <HabitsGrid habits={habits} />}
        {!hasHabits && <EmptyState onClick={handleShowToggle} />}
      </Layout>
    </motion.main>
  );
};

const PageHeader = ({ hasHabits, handleShowToggle }) => {
  const { deleteAllHabits } = useHabitsActions();
  const dialog = useDialog();

  const handleDelete = () => {
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete all habits",
      catchOnCancel: false,
      submitText: "Confirm",
    })
      .then(() => setTimeout(() => deleteAllHabits(), 100))
      .finally(() => toast.success(`All habits were successfully deleted`));
  };

  return (
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-3xl font-semibold">My Habits</h1>

      {hasHabits && (
        <div className="flex gap-3">
          <IconTextButton
            onClick={handleShowToggle}
            text="new habit"
            className="bg-green-600 font-bold"
            icon={<PlusIcon className="block h-4 w-4" strokeWidth="3" />}
          />
          <IconButton
            aria-label="remove all habits"
            className="group rounded-md bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-zinc-300"
            onClick={handleDelete}
          >
            <TrashIcon
              className="transition-colors group-hover:text-zinc-50 h-5 w-5"
              strokeWidth={2}
            />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const HabitsGrid = ({ habits }) => {
  console.log(habits);
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

      <Button
        onClick={onClick}
        className="bg-green-600 font-bold hover:opacity-95 "
      >
        create an habit
      </Button>

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
