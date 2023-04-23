import clsx from "clsx";
import { useMemo } from "react";
import { Button } from "../../components/Buttons";

const HabitsSorting = ({ onClick, sortCriteria }) => {
  const sortModes = useMemo(() => [
    { mode: "oldest", label: "older" },
    { mode: "completed", label: "most completed" },
  ]);

  return (
    <div className=" my-4  text-neutral-100">
      <span className="block mb-2 font-semibold text-zinc-400 w-max ">
        Sort by{" "}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {sortModes.map(({ mode, label }) => (
          <Button
            id={mode}
            key={mode}
            onClick={onClick}
            className={clsx(
              `font-semibold border-2 border-zinc-500 hover:opacity-90 outline-none focus-within:ring-2 focus-within:ring-zinc-600 focus:ring-2 focus:ring-zinc-600`,
              mode === sortCriteria
                ? "bg-zinc-500"
                : "bg-zinc-500/40 text-zinc-200"
            )}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HabitsSorting;
