import clsx from "clsx";
import { useMemo, useState } from "react";
import { useHabitsActions } from "../../store/useHabitsStore";

const HabitsSorting = ({ onClick, sortCriteria }) => {
  // const [sortMode, setSortMode] = useState("");

  const { sortHabits } = useHabitsActions();

  // const handleSort = (e) => {
  //   const mode = e.target.id;
  //   setSortMode(mode === sortMode ? "" : mode);
  //   sortHabits(mode === sortMode ? "" : mode);
  // };

  const sortModes = useMemo(() => [
    { mode: "oldest", label: "older" },
    { mode: "completed", label: "most completed" },
  ]);

  return (
    <div className=" my-4  text-neutral-100">
      <span className="block mb-2 font-semibold text-zinc-400">sort by </span>

      <div className="flex flex-wrap items-center gap-2">
        {sortModes.map(({ mode, label }) => (
          <button
            id={mode}
            key={mode}
            onClick={onClick}
            className={clsx(
              `h-10 px-6 font-semibold rounded-md border-2 border-zinc-500`,
              mode === sortCriteria
                ? "bg-zinc-500"
                : "bg-zinc-500/40 text-zinc-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HabitsSorting;
