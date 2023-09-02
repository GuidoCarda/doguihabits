import React from "react";
import { getDayMonthYear, getWeekDayString, startOfDay } from "../../utils";
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
import { IconButton } from "../../components/Buttons";

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

  const getCompletionPercentage = (habit) => {
    const { daysStateCount } = habit;
    const totalCount = daysStateCount.completed + daysStateCount.failed;
    return totalCount ? (daysStateCount.completed * 100) / totalCount : 0;
  };

  const completionPercentage = getCompletionPercentage(habit).toFixed(0);

  return (
    <motion.div
      layout="preserve-aspect"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "bg-zinc-800 rounded-xl text-neutral-100 space-y-4 w-full  mx-auto",
        "md:max-w-max md:mx-0"
      )}
    >
      <div className="flex px-4 pt-4 items-center justify-between gap-4">
        <Link
          to={`/habits/${habit.id}`}
          className="relative outline-none group w-full focus:translate-x-1 hover:translate-x-1 transition-transform truncate"
        >
          <span className="block transition-transform  font-bold text-lg">
            {habit.title}
          </span>
          <span className="text-xs group-focus:bg-emerald-400/20 group-focus:text-zinc-50 group-hover:bg-emerald-400/20 group-hover:text-zinc-50 bg-zinc-700 text-zinc-300  font-normal w-max h-5 leading-2 grid place-items-center px-2 rounded-sm">
            created at {getDayMonthYear(habit.createdAt).join("/")}
          </span>
        </Link>
        <IconButton
          aria-label="delete habit"
          onClick={handleDelete}
          className={"group hover:bg-red-700/30 bg-zinc-700 flex-shrink-0"}
        >
          <TrashIcon className="h-4 transition-transform group-hover:text-red-500 group-hover:scale-110" />
        </IconButton>
      </div>

      <div className="grid grid-cols-7 gap-4 px-4">
        {lastWeek.map(({ id, state }, idx) => {
          const [day] = getDayMonthYear(id);

          return (
            <div key={`day-${id}`}>
              <span className="block text-xs w-10 text-center font-semibold text-zinc-400 pb-1">
                {getWeekDayString(startOfDay(id).getDay()).slice(0, 3)}
              </span>
              <button
                aria-label="toggle habit state"
                onClick={() => updateHabit(habit.id, id)}
                className={clsx(
                  "rounded-md h-10 w-10 font-semibold border-2 border-transparent transition-colors duration-300",
                  {
                    "bg-success": state === "completed",
                    "bg-failed": state === "failed",
                    "bg-zinc-700": state !== "failed" && state !== "completed",
                  },
                  "outline-none hover:border-white/30 focus:ring-2 focus:ring-white/20"
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t-2 px-4 pb-2 pt-2 border-zinc-700 flex gap-2">
        <div className="flex group items-center gap-1 ">
          <FireIcon className="h-5 w-5 text-red-500" strokeWidth="2" />
          <span className="text-sm  group-hover:text-zinc-100 text-zinc-300 font-semibold select-none">
            {habit.currentStreak}
          </span>
        </div>
        <div className="flex group items-center gap-1 ">
          <CheckBadgeIcon className="h-5 w-5 text-green-500" strokeWidth="2" />
          <span className="text-sm group-hover:text-zinc-100 text-zinc-300 font-semibold select-none">
            {completionPercentage}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitsWeekView;
