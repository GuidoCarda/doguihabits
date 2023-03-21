import React from "react";
import { Link } from "react-router-dom";
import { useHabitsActions } from "../../store/store";
import { getDayMonthYear } from "../../utils";
import { TrashIcon } from "@heroicons/react/24/outline";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useDialog } from "../../store/useDialogStore";

const HabitsWeekView = ({ habit }) => {
  const { updateHabit, deleteHabit } = useHabitsActions();

  const currentDate = new Date();

  const habitIndex = habit.days.findIndex((day) => {
    return new Date(day.id).getDate() === currentDate.getDate();
  });

  const lastWeek = habit.days.slice(habitIndex - 6, habitIndex + 1);

  const dialog = useDialog();

  const handleDelete = () => {
    //Throw a confirmation dialog
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
    }).then(() => deleteHabit(habit.id));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "bg-zinc-600 rounded-xl p-4 text-neutral-100 space-y-4 w-full  mx-auto",
        "md:max-w-max md:mx-0"
      )}
    >
      <div className="flex items-center">
        <Link
          to={`/habits/${habit.id}`}
          className="font-bold text-lg w-full block"
        >
          {habit.title}
        </Link>
        <button
          onClick={handleDelete}
          className="h-10 w-10 bg-zinc-500 rounded-md grid place-content-center"
        >
          <TrashIcon className="h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {lastWeek.map(({ id, state }) => {
          const [day] = getDayMonthYear(id);

          return (
            <button
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
          );
        })}
      </div>
    </motion.div>
  );
};

export default HabitsWeekView;
