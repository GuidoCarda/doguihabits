import { useMemo } from "react";

const HabitsSorting = ({ handleSort }) => {
  const sortModes = useMemo(() => [
    { mode: "older", label: "older" },
    { mode: "newer", label: "newer" },
    { mode: "most-completed", label: "most completed" },
  ]);

  return (
    <div className=" my-4  text-neutral-100">
      <span className="block mb-2 font-semibold text-zinc-400">sort by </span>

      <div className="flex flex-wrap items-center gap-2">
        {sortModes.map(({ mode, label }) => (
          <button
            id={mode}
            key={mode}
            onClick={handleSort}
            className="bg-zinc-500 h-10 px-6 font-semibold rounded-md"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HabitsSorting;
