import React from "react";
import { getPast7Days } from "../../store/store";

const HabitsWeekView = () => {
  const week = getPast7Days()
    .reverse()
    .map((date) => {
      const day = date.getDate();

      return { day, state: "pending" };
    });

  return (
    <div className="bg-zinc-600 rounded-xl p-4 text-neutral-100 space-y-4 max-w-max mx-auto md:mx-0">
      <h2 className="font-bold text-lg">Coding</h2>
      <div className="grid grid-cols-7 gap-4">
        {week.map(({ day, state }) => (
          <button
            className={`rounded-md h-10 w-10 font-semibold ${
              state === "completed"
                ? "bg-green-500"
                : state === "failed"
                ? "bg-red-500"
                : "bg-zinc-700"
            } `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

// const week = [
//   {
//     day: 0,
//     state: "completed",
//   },
//   {
//     day: 1,
//     state: "failed",
//   },
//   {
//     day: 2,
//     state: "completed",
//   },
//   {
//     day: 3,
//     state: "pending",
//   },
//   {
//     day: 4,
//     state: "failed",
//   },
//   {
//     day: 5,
//     state: "failed",
//   },
//   {
//     day: 6,
//     state: "pending",
//   },
// ];

export default HabitsWeekView;
