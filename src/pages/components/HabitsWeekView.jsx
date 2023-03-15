import React from "react";

const HabitsWeekView = () => {
  const habits = [...Array(4).keys()];

  return (
    <div className="bg-zinc-600 rounded-xl p-8 text-neutral-100">
      <h2 className="text-2xl font-semibold mb-6">Habits</h2>

      <div className="flex flex-col gap-8">
        {habits.map((habit) => (
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <span className="text-neutral-100 text-lg">Coding</span>

            <div className="flex-shrink-0 grid grid-cols-7 gap-4 overflow-hidden">
              {[...Array(7).keys()].map((day) => (
                <button className="h-12 w-12 rounded-md bg-zinc-300 text-black/50 text-lg font-bold">
                  {day}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitsWeekView;
