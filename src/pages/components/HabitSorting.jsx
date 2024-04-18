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
      <span className="block mb-2 select-none leading-none text-zinc-400 w-max ">
        Sort by{" "}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {sortModes.map(({ mode, label }) => (
          <Button
            id={mode}
            key={mode}
            onClick={onClick}
            className={clsx(
              "border-2  transition-all text-zinc-400",
              "hover:border-zinc-700 hover:text-zinc-300",
              mode === sortCriteria
                ? "border-emerald-500/50 text-zinc-50 hover:border-emerald-500/50 hover:text-zinc-50"
                : "border-zinc-800"
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
