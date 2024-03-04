import clsx from "clsx";
import React from "react";
import {
  getAllDaysInMonth,
  getDayMonthYear,
  getMonthString,
  getPrevMonthPlaceholderDates,
  getWeekDayString,
  isPast,
  isSameDay,
  isThisMonth,
} from "../../utils";
import { ENTRY_STATE } from "../../constants";

const HabitMonthlyView = (props) => {
  const { date, entries, toggleHabitDay } = props;

  const today = new Date();
  const month = getAllDaysInMonth(date.getFullYear(), date.getMonth()).map(
    (date) => {
      const day = entries?.find((day) => isSameDay(day.date, date));
      return day || { date, state: ENTRY_STATE.pending };
    }
  );

  const isCurrentMonth = isThisMonth(month[0].date);
  const [, monthNumber, year] = getDayMonthYear(month[0].date);

  return (
    <div className="bg-zinc-800 p-4 md:px-6 rounded-xl ">
      <header className="flex justify-between items-center mb-6">
        <span className="block ml-auto text-sm py-1 px-2 rounded-md bg-emerald-500 text-zinc-899">
          {getMonthString(monthNumber - 1)}
          <span className="ml-2">{year}</span>
        </span>
      </header>

      <ul className="grid grid-cols-7 gap-2">
        {month.map((day, idx) => (
          <li key={idx} className="aspect-square md:h-10 md:w-10">
            <button
              disabled={isCurrentMonth && idx + 1 > today.getDate()}
              aria-label="toggle habit state"
              onClick={() => toggleHabitDay(day.date)}
              className={clsx(
                "w-full h-full rounded-md border-2 border-transparent text-white font-semibold transition-colors",
                {
                  "bg-success": day.state === ENTRY_STATE.completed,
                  "bg-failed": day.state === ENTRY_STATE.failed,
                  "bg-zinc-700":
                    isPast(day.date) &&
                    day.state !== ENTRY_STATE.failed &&
                    day.state !== ENTRY_STATE.completed,
                },
                "disabled:cursor-not-allowed disabled:text-white/30 disabled:bg-transparent",
                "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20"
              )}
            >
              {idx + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitMonthlyView;
