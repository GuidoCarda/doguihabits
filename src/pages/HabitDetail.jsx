import React from "react";

//Routing
import { Link, useNavigate, useParams } from "react-router-dom";

//Global state hooks
import useHabitsStore, {
  useHabit,
  useHabitsActions,
} from "../store/useHabitsStore";
import useDialogStore, { useDialog } from "../store/useDialogStore";

//Components
import Layout from "../components/Layout";
import HabitMonthlyView from "./components/HabitMonthlyView";

//Icons
import {
  ArrowLeftCircleIcon,
  CheckIcon,
  FireIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { motion } from "framer-motion";
import useKeyPress from "../hooks/useKeyPress";
import { toast } from "react-hot-toast";
import { IconTextButton } from "../components/Buttons";

const HabitDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const dialog = useDialog();
  const isDialogOpen = useDialogStore((state) => state.open);
  const handleDialogClose = useDialogStore((state) => state.handleClose);

  const { deleteHabit, updateHabit } = useHabitsActions();

  const completionMilestones = useHabitsStore(
    (state) => state.completionMilestones
  );

  const habit = useHabit(id);

  const keysToAction = [
    {
      keys: ["shiftKey", "d"],
      conditionals: [habit],
      callback: () => handleDelete(id),
    },
    {
      keys: ["Escape"],
      conditionals: [isDialogOpen, habit],
      callback: handleDialogClose,
    },
    {
      keys: ["Escape"],
      conditionals: [!isDialogOpen],
      callback: () => navigate("/"),
    },
  ];

  useKeyPress(keysToAction);

  if (!habit) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="max-w-sm flex flex-col text-center items-center gap-4 ">
          <h2 className="text-3xl font-bold text-zinc-300">
            Something went wrong
          </h2>
          <p className="text-zinc-500">
            It looks like the searched habit habit doesn't exists or something
            went wrong on the loading process
          </p>
          <Link
            to="/"
            className="h-10 text-zinc-800 bg-zinc-200 rounded-md flex items-center px-4 mt-10"
          >
            Return to the home page
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = (habitId) => {
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
    })
      .then(() => {
        deleteHabit(habitId);
        navigate("/");
      })
      .finally(() => toast.success(`${habit.title} was successfully deleted`));
  };

  const habitInfo = [
    { title: "streak", data: habit.currentStreak, icon: "FireIcon" },
    {
      title: "completed",
      data: habit.daysStateCount.completed,
      icon: "CheckIcon",
    },
    { title: "failed", data: habit.daysStateCount.failed, icon: "XMarkIcon" },
  ];

  const toggleHabitDay = (dayId) => {
    updateHabit(habit.id, dayId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" text-neutral-100  max-h-screen overflow-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-zinc-500 md:scrollbar-thumb-rounded-xl"
    >
      <Layout>
        <HabitDetailHeader habit={habit} handleDelete={handleDelete} />

        <div className="mb-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {habitInfo.map((info) => (
            <DashboardDetail key={info.title} {...info} />
          ))}
        </div>

        <HabitMontlyViewGrid habit={habit} toggleHabitDay={toggleHabitDay} />

        <div className="mt-10  pb-4">
          <h2 className="text-2xl font-bold mb-6">Milestones</h2>
          <ul className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-full pb-4">
            {completionMilestones.map((milestone) => (
              <li
                key={`${milestone}-days-badge`}
                className={`${
                  !habit?.badges.includes(milestone) ? "grayscale" : ""
                } text-center bg-zinc-700 h-24 w-24 rounded-lg  grid content-center transition-color duration-500 flex-shrink-0 `}
              >
                <span className="block text-4xl font-bold text-emerald-500">
                  {milestone}
                </span>
                <span className="block text-zinc-400">days</span>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </motion.div>
  );
};

const HabitDetailHeader = ({ habit, handleDelete }) => {
  const { id, title } = habit;
  return (
    <div className="mb-10 flex items-center">
      <Link to={"/"} aria-label="back to home">
        <ArrowLeftCircleIcon className="h-10 w-10 text-neutral-500 hover:text-neutral-400 transition-colors" />
      </Link>
      <h2 className="text-3xl font-bold ml-4 truncate">{title}</h2>

      <IconTextButton
        onClick={() => handleDelete(id)}
        text="Delete Habit"
        icon={<TrashIcon className="block h-4 w-4" />}
        className="ml-auto bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-white font-bold rounded-md"
      />
    </div>
  );
};

const HabitMontlyViewGrid = ({ habit, toggleHabitDay }) => {
  return (
    <ul className="text-neutral-100  flex flex-col gap-4 sm:grid md:grid-cols-2 xl:grid-cols-3 ">
      {habit.months.map((month, idx) => (
        <li key={`${habit.id}-${idx}`}>
          <HabitMonthlyView month={month} toggleHabitDay={toggleHabitDay} />
        </li>
      ))}
    </ul>
  );
};

const DashboardDetail = ({ title, data, icon }) => {
  return (
    <div className="p-4 w-full bg-zinc-600  rounded-2xl flex items-center justify-around gap-6 ">
      <div className="text-center -space-y-1">
        <h4 className="font-semibold text-zinc-400">{title}</h4>
        <h2 className="text-3xl font-bold">{data}</h2>
      </div>
      <span className=" grid place-content-center h-20 w-20 rounded-full bg-zinc-700">
        {icon == "FireIcon" && <FireIcon className="h-12 text-red-500" />}
        {icon == "XMarkIcon" && <XMarkIcon className="h-12 text-rose-500" />}
        {icon == "CheckIcon" && <CheckIcon className="h-12 text-green-500" />}
      </span>
    </div>
  );
};

export default HabitDetail;
