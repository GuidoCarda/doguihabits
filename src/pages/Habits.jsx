import React, { useState } from "react";
import Layout from "../components/Layout";
import Modal, { Backdrop } from "../components/Modal";
import useHabitsStore, { useHabitsActions } from "../store/store";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";

import ReactDom from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import useMediaQuery from "../hooks/useMediaQuery";
import { useConfirm } from "../context/ConfirmDialogContext";

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

  const isMobile = useMediaQuery("(max-width: 638px)");

  return (
    <div className=" text-neutral-100 min-h-screen">
      <Layout>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold">My Habits</h1>

          <button
            onClick={handleShowToggle}
            className="h-10 px-4 bg-green-600 font-bold rounded-md"
          >
            new habit
          </button>
        </div>

        {habits.length > 1 && <HabitsSorting handleSort={handleSort} />}

        <AnimatePresence>
          {isOpen && (
            <Modal
              key={"new_habit_modal"}
              onClose={() => setIsOpen(false)}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        {true && <ConfirmationDialog></ConfirmationDialog>}

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

export const ConfirmationDialog = ({
  isOpen,
  title,
  description,
  confirmBtnLabel,
}) => {
  if (!isOpen) return;

  return ReactDom.createPortal(
    <Backdrop>
      <div className="absolute bg-zinc-700 rounded-lg w-full max-w-lg p-4">
        <header>
          <h2 className="text-2xl text-zinc-200 font-semibold">{title}</h2>
        </header>

        <div className="py-4">
          <p className="text-zinc-300"> {description}</p>
        </div>

        <footer className="flex gap-2">
          <button className="ml-auto bg-zinc-600 text-neutral-100 rounded-md h-10 px-4">
            cancel
          </button>
          <button className=" bg-emerald-500/20 border-2 border-emerald-700 text-neutral-100 rounded-md h-10 px-4">
            {confirmBtnLabel}
          </button>
        </footer>
      </div>
    </Backdrop>,
    document.getElementById("portal")
  );
};
