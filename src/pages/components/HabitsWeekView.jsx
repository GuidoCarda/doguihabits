import React from "react";
import { Link } from "react-router-dom";
import { useHabitsActions } from "../../store/store";
import { getDayMonthYear } from "../../utils";

import { motion } from "framer-motion";
import clsx from "clsx";

const HabitsWeekView = ({ habit }) => {
  const { updateHabit } = useHabitsActions();

  const currentDate = new Date();

  const habitIndex = habit.days.findIndex((day) => {
    return new Date(day.id).getDate() === currentDate.getDate();
  });

  const lastWeek = habit.days.slice(habitIndex - 6, habitIndex + 1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-600 rounded-xl p-4 text-neutral-100 space-y-4 max-w-max mx-auto md:mx-0"
    >
      <Link
        to={`/habits/${habit.id}`}
        className="font-bold text-lg w-full block"
      >
        {habit.title}
      </Link>
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
