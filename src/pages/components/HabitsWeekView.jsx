import React from "react";
import { getDayMonthYear, startOfDay } from "../../utils";
import { useHabitsActions } from "../../store/useHabitsStore";
import { useDialog } from "../../store/useDialogStore";

//Animations, styling
import { motion } from "framer-motion";
import clsx from "clsx";

//Routing
import { Link } from "react-router-dom";

//Icons
import {
  CheckBadgeIcon,
  CheckIcon,
  FireIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const weekDays = ["Sab", "Dom", "Lun", "Mar", "Mie", "Jue", "Vie"];

const HabitsWeekView = ({ habit }) => {
  const { updateHabit, deleteHabit } = useHabitsActions();

  const dialog = useDialog();

  const handleDelete = () => {
    //Throw a confirmation dialog
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
    })
      .then(() => setTimeout(() => deleteHabit(habit.id), 100))
      .finally(() => toast.success(`${habit.title} was successfully deleted`));
  };

  const currentDate = new Date();

  const currentMonthIndex = habit.months.findIndex(
    (month) => startOfDay(month[0].id).getMonth() === currentDate.getMonth()
  );

  let lastWeek = habit.months
    .at(-1)
    .filter((day) => new Date(day.id).getDate() <= currentDate.getDate())
    .slice(-7);

  if (lastWeek.length < 7) {
    // if we are on the first days of the month and if the habit has prev data
    if (currentMonthIndex > 0) {
      const prevMonth = [...habit.months.at(-2)];
      lastWeek = [
        ...prevMonth.slice(prevMonth.length - 7 + lastWeek.length),
        ...lastWeek,
      ];
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "bg-zinc-600 rounded-xl text-neutral-100 space-y-4 w-full  mx-auto",
        "md:max-w-max md:mx-0"
      )}
    >
      <div className="flex px-4 pt-4 items-center justify-between">
        <Link
          to={`/habits/${habit.id}`}
          className="font-bold text-lg w-full block truncate"
        >
          {habit.title}
          <span className="text-xs bg-zinc-400/40 text-zinc-300 font-normal w-max h-5 grid place-items-center px-1 rounded-sm">
            created at {getDayMonthYear(habit.createdAt).join("/")}
          </span>
        </Link>
        <button
          aria-label="delete habit"
          onClick={handleDelete}
          className="h-10 w-10 bg-zinc-500  rounded-md grid place-content-center"
        >
          <TrashIcon className="h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 px-4">
        {lastWeek.map(({ id, state }, idx) => {
          const [day] = getDayMonthYear(id);

          return (
            <div>
              <span className="block text-xs w-full text-center font-semibold text-zinc-400 pb-1">
                {weekDays[idx]}
              </span>
              <button
                aria-label="toggle habit state"
                onClick={() => updateHabit(habit.id, id)}
                key={`day-${id}`}
                className={clsx("rounded-md h-10 w-10 font-semibold", {
                  "bg-success": state === "completed",
                  "bg-failed": state === "failed",
                  "bg-zinc-700": state !== "failed" && state !== "completed",
                })}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t-2 px-4 pb-2 pt-2 border-zinc-500/50 flex gap-2">
        <div className="flex items-center gap-1">
          <FireIcon className="h-5 w-5 text-red-500" strokeWidth="2" />
          <span className="text-smtext-zinc-300 font-semibold">3</span>
        </div>
        <div className="flex items-center gap-1 ">
          <CheckBadgeIcon className="h-5 w-5 text-green-500" strokeWidth="2" />
          <span className="text-smtext-zinc-300 font-semibold">46%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitsWeekView;
