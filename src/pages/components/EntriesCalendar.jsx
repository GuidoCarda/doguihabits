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
} from "../../utils";
import { ENTRY_STATE } from "../../constants";
import { AnimatePresence, motion } from "framer-motion";

const EntriesCalendar = (props) => {
  const { date, entries, onDateClick } = props;

  const firstDayOfMonth = date.getDay();
  const placeholder = getPrevMonthPlaceholderDates(date, firstDayOfMonth).map(
    (date) => ({ date, state: ENTRY_STATE.pending })
  );

  const month = placeholder.concat(
    getAllDaysInMonth(date.getFullYear(), date.getMonth()).map((date) => {
      const day = entries?.find((day) => isSameDay(day.date, date));
      return day || { date, state: ENTRY_STATE.pending };
    })
  );

  return (
    <div className="border-2 border-zinc-800 p-4 md:px-6 rounded-xl overflow-hidden h-[350px] ">
      <AnimatePresence mode="popLayout" initial={false}>
        <div>
          <div className="grid grid-cols-7 gap-2 place-items-center text-zinc-400 mb-2">
            {[...Array(7).keys()].map((day) => (
              <span key={day}>{getWeekDayString(day).slice(0, 3)}</span>
            ))}
          </div>
          <motion.ul
            key={date}
            initial={{ x: -20, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0.6 }}
            className="grid grid-cols-7 gap-2"
          >
            {month.map((day, idx) => {
              if (
                day.date.getFullYear() < date.getFullYear() ||
                (day.date.getFullYear() === date.getFullYear() &&
                  day.date.getMonth() < date.getMonth())
              ) {
                return <span key={idx} />;
              }

              return (
                <li key={idx} className="aspect-square h-10 w-10">
                  <button
                    disabled={!isPast(day.date)}
                    aria-label="toggle habit state"
                    onClick={() => onDateClick(day.date)}
                    className={clsx(
                      "w-full h-full rounded-md border-2 border-transparent text-white font-semibold transition-colors",
                      {
                        "bg-success": day.state === ENTRY_STATE.completed,
                        "bg-failed": day.state === ENTRY_STATE.failed,
                        "bg-zinc-700":
                          day.state !== ENTRY_STATE.failed &&
                          day.state !== ENTRY_STATE.completed,
                      },
                      "disabled:cursor-not-allowed disabled:text-white/30 disabled:bg-transparent",
                      "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20"
                    )}
                  >
                    {day.date.getDate()}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default EntriesCalendar;
