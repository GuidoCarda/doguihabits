import clsx from "clsx";
import React from "react";
import { useHabitsActions } from "../../store/useHabitsStore";

const HabitMonthlyView = (props) => {
  const { habit } = props;

  const { updateHabit } = useHabitsActions();

  const toggleHabitDay = (habitId, dayId) => {
    updateHabit(habitId, dayId);
  };

  const currentDate = new Date().getDate();

  return (
    <div className="bg-zinc-600 px-6 py-6 rounded-md ">
      <header className="flex justify-between items-center mb-6">
        <span className="block ml-auto text-sm py-1 px-2 rounded-md bg-green-500/60">
          March
        </span>
      </header>

      <ul className="grid grid-cols-7 gap-2">
        {habit.days.map((day, idx) => (
          <li key={idx} className="h-10 w-10">
            <button
              disabled={idx + 1 > currentDate}
              onClick={() => toggleHabitDay(habit.id, day.id)}
              className={clsx(
                "w-full h-full rounded-md text-black/40 font-semibold ",
                "disabled:bg-zinc-500 disabled:cursor-not-allowed",
                {
                  "bg-success": day.state === "completed",
                  "bg-failed": day.state === "failed",
                  "bg-neutral-300":
                    day.state !== "failed" && day.state !== "completed",
                }
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
