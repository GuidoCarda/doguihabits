import React from "react";
import {
  getDayMonthYear,
  getHabitStreak,
  getPast7Days,
  getTotal,
  getWeekDayString,
  isSameDay,
  startOfDay,
} from "../../utils";
import { useDialog } from "../../store/useDialogStore";

//Animations, styling
import { motion } from "framer-motion";
import clsx from "clsx";

//Routing
import { Link } from "react-router-dom";

//Icons
import {
  CheckBadgeIcon,
  FireIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { toast } from "react-hot-toast";
import { IconButton } from "../../components/Buttons";
import { Tooltip } from "../Habits";

import { useAuth } from "../../context/AuthContext";

//Api hooks
import useUpdateHabitEntry from "../../hooks/api/useUpdateHabitEntry";
import useDeleteHabit from "../../hooks/api/useDeleteHabit";
import { ENTRY_STATE } from "../../constants";

const HabitsWeekView = ({ habit }) => {
  const dialog = useDialog();
  const { user } = useAuth();

  const habitDeleteMutation = useDeleteHabit(habit.id, user.uid);
  const mutation = useUpdateHabitEntry();

  const handleDelete = () => {
    //Throw a confirmation dialog
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
      isPending: habitDeleteMutation.isPending,
      pendingText: "Deleting...",
      onConfirm: () =>
        habitDeleteMutation.mutateAsync(habit.id, {
          onError: () => {
            toast.error("An error occurred while deleting the habit");
          },
          onSuccess: () => {
            toast.success("Habit deleted successfully");
          },
        }),
    });
  };

  if (habit.isCreating) {
    return <HabitWeekViewSkeleton title={habit.title} />;
  }

  const currentDate = startOfDay(new Date());

  const lastWeek = getPast7Days(currentDate)
    .sort((a, b) => a - b)
    .map((date) => {
      const entry = habit.entries.find((entry) => {
        return isSameDay(entry.date, date);
      });

      return {
        id: entry?.id,
        date: date,
        state: entry?.state || ENTRY_STATE.pending,
      };
    });

  const getCompletionPercentage = (entries) => {
    const daysStateCount = {
      completed: getTotal(entries, ENTRY_STATE.completed),
      failed: getTotal(entries, ENTRY_STATE.failed),
    };
    const totalCount = daysStateCount.completed + daysStateCount.failed;
    return totalCount ? (daysStateCount.completed * 100) / totalCount : 0;
  };

  const currentStreak = getHabitStreak(habit.entries);
  const completionPercentage = getCompletionPercentage(habit.entries).toFixed(
    0
  );

  return (
    <motion.div
      layout="preserve-aspect"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "bg-zinc-800 rounded-xl text-neutral-100 space-y-4 w-full",
        "sm:max-w-max sm:mx-auto md:mx-0",
        {
          "opacity-20 animate-pulse duration-100": habit?.isDeleting,
        }
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

      <div className="grid grid-cols-7 px-4 gap-4  ">
        {lastWeek.map(({ id, date, state }) => {
          const [day] = getDayMonthYear(date);
          return (
            <div
              key={`day-${day}`}
              className={clsx("grid place-content-center")}
            >
              <span
                className={clsx(
                  "block text-xs text-center font-semibold text-zinc-400 pb-1"
                )}
              >
                {getWeekDayString(startOfDay(date).getDay()).slice(0, 3)}
              </span>
              <button
                aria-label="toggle habit state"
                disabled={
                  startOfDay(date).getFullYear() <
                    startOfDay(habit.createdAt).getFullYear() ||
                  (startOfDay(date).getMonth() <
                    startOfDay(habit.createdAt).getMonth() &&
                    startOfDay(date).getFullYear() ===
                      startOfDay(habit.createdAt).getFullYear())
                }
                onClick={() =>
                  mutation.mutate(
                    {
                      habitId: habit.id,
                      entryDate: date,
                      entries: habit.entries,
                    },
                    {
                      onError: () => {
                        toast.error(
                          "Sorry, An error occurred while updating the habit"
                        );
                      },
                    }
                  )
                }
                className={clsx(
                  "rounded-md h-10 w-10 font-semibold border-2 border-transparent transition-colors duration-300",
                  {
                    "bg-success": state === ENTRY_STATE.completed,
                    "bg-failed": state === ENTRY_STATE.failed,
                    "bg-zinc-700":
                      state !== ENTRY_STATE.failed &&
                      state !== ENTRY_STATE.completed,
                  },
                  "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20",
                  "disabled:cursor-not-allowed disabled:text-white/30 disabled:bg-transparent"
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t-2 px-4 pb-2 pt-2 border-zinc-700 flex gap-2">
        <Tooltip label="Streak">
          <div className="flex group items-center gap-1 ">
            <FireIcon className="h-5 w-5 text-red-500" strokeWidth="2" />
            <span className="text-sm  group-hover:text-zinc-100 text-zinc-300 font-semibold select-none">
              {currentStreak}
            </span>
          </div>
        </Tooltip>
        <Tooltip label="Completion Percentage">
          <div className="flex group items-center gap-1 ">
            <CheckBadgeIcon
              className="h-5 w-5 text-green-500"
              strokeWidth="2"
            />
            <span className="text-sm group-hover:text-zinc-100 text-zinc-300 font-semibold select-none">
              {completionPercentage}%
            </span>
          </div>
        </Tooltip>
      </div>
    </motion.div>
  );
};

function HabitWeekViewSkeleton({ title }) {
  return (
    <motion.div
      layout="preserve-aspect"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "bg-zinc-800 rounded-xl text-neutral-100 space-y-4 w-full mx-auto select-none",
        "md:max-w-max md:mx-0",
        "opacity-20 animate-pulse duration-100"
      )}
    >
      <div className="flex px-4 pt-4 items-center justify-between gap-4">
        <div>
          <span className="block font-bold text-lg">{title}</span>
          <span className="text-xs  bg-zinc-700 text-zinc-300  w-28 h-4 leading-2 grid place-items-center px-2 rounded-sm"></span>
        </div>
        <IconButton
          aria-label="delete habit"
          disabled
          className={"bg-zinc-700 flex-shrink-0 cursor-auto"}
        ></IconButton>
      </div>

      <div className="grid grid-cols-7 gap-4 px-4">
        {getPast7Days()
          .sort((a, b) => a - b)
          .map((date, index) => {
            return (
              <div key={`day-${index}`}>
                <span className="block text-xs w-10 text-center font-semibold text-zinc-400 pb-1">
                  {getWeekDayString(date.getDay()).slice(0, 3)}
                </span>
                <button
                  aria-label="toggle habit state"
                  disabled
                  className={clsx(
                    "rounded-md h-10 w-10 font-semibold border-2 border-transparent transition-colors duration-300 bg-zinc-700",
                    "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20"
                  )}
                ></button>
              </div>
            );
          })}
      </div>

      <div className="border-t-2 px-4 pb-2 pt-2  text-zinc-400  grayscale  border-zinc-700 flex gap-2">
        <div className="flex  items-center gap-1">
          <FireIcon className="h-5 w-5 " strokeWidth="2" />
          <span className="text-sm   font-semibold select-none">-</span>
        </div>
        <div className="flex group items-center gap-1 ">
          <CheckBadgeIcon className="h-5 w-5 " strokeWidth="2" />
          <span className="text-sm  font-semibold select-none">-</span>
        </div>
      </div>
    </motion.div>
  );
}

export default HabitsWeekView;
