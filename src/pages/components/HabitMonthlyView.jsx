import clsx from "clsx";
import React from "react";

import { motion } from "framer-motion";
import {
  getMonthString,
  isFuture,
  isPast,
  isSameMonth,
  startOfDay,
} from "../../utils";

const habitVariant = {
  completed: { backgroundColor: "rgb(16 185 129)" },
  failed: { backgroundColor: "rgb(239 68 68)" },
  pending: { backgroundColor: "rgb(63 63 70)" },
  disabled: { backgroundColor: "rgb(113 113 122)" },
};

const HabitMonthlyView = (props) => {
  const { month, toggleHabitDay } = props;

  const today = new Date();
  const isCurrentMonth = isSameMonth(month[0].id);

  return (
    <div className="bg-zinc-600 px-6 py-6 rounded-md ">
      <header className="flex justify-between items-center mb-6">
        <span className="block ml-auto text-sm py-1 px-2 rounded-md bg-green-500/60">
          {getMonthString(new Date(month[0].id).getMonth())}
        </span>
      </header>

      <ul className="grid grid-cols-7 gap-2">
        {month.map((day, idx) => (
          <li key={day.id} className="h-10 w-10">
            <motion.button
              variants={habitVariant}
              initial="pending"
              animate={isPast(day.id) ? day.state : "disabled"}
              disabled={isCurrentMonth && idx + 1 > today.getDate()}
              aria-label="toggle habit state"
              onClick={() => toggleHabitDay(day.id)}
              className={clsx(
                "w-full h-full rounded-md text-white font-semibold ",
                "disabled:cursor-not-allowed disabled:text-black/40"
              )}
            >
              {idx + 1}
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitMonthlyView;
