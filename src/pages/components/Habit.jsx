import React from "react";
import { useHabitsActions } from "../../store/store";

const Habit = (props) => {
  const { habit } = props;

  const { updateHabit, deleteHabit } = useHabitsActions();

  const toggleHabitDay = (habitId, dayId) => {
    updateHabit(habitId, dayId);
  };

  const currentDate = new Date().getDate();

  return (
    <div className="bg-zinc-600 px-6 py-6 rounded-md ">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl  font-bold capitalize">{habit.title}</h2>
        <button
          className="h-8 w-8 grid place-content-center bg-zinc-400 rounded-md"
          onClick={() => deleteHabit(habit.id)}
        >
          X
        </button>
      </header>

      <ul className="grid grid-cols-7 gap-2">
        {habit.days.map((day, idx) => (
          <li key={idx} className="h-10 w-10">
            <button
              disabled={idx + 1 > currentDate}
              onClick={() => toggleHabitDay(habit.id, day.id)}
              className={`w-full h-full ${
                day.state === "completed"
                  ? "bg-success"
                  : day.state === "failed"
                  ? "bg-failed"
                  : "bg-neutral-300"
              } rounded-md text-black/40 font-semibold disabled:bg-zinc-500`}
            >
              {idx + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Habit;
