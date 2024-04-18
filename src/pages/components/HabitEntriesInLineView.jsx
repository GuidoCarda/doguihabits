import { useParams } from "react-router-dom";
import {
  cn,
  getDatesInRange,
  getFirstDayOfMonth,
  isPast,
  isSameDay,
  isThisMonth,
} from "../../utils";
import { useHabit } from "../../hooks/api/useHabits";
import useUpdateHabitEntry from "../../hooks/api/useUpdateHabitEntry";
import { ENTRY_STATE } from "../../constants";

const HabitEntriesInLineView = () => {
  const today = new Date();
  const { id } = useParams();
  const habitQuery = useHabit(id);

  const updateHabitEntryMutation = useUpdateHabitEntry(id);

  const toggleHabitDay = (entryDate) => {
    updateHabitEntryMutation.mutate({
      habitId: id,
      entryDate,
      entries,
    });
  };

  const createdAt = habitQuery?.data.createdAt;

  const entries = getDatesInRange(getFirstDayOfMonth(createdAt), today).map(
    (date) =>
      habitQuery?.data?.entries?.find((entry) =>
        isSameDay(entry.date, date)
      ) || {
        date,
        state: ENTRY_STATE.pending,
      }
  );

  return (
    <div>
      <h2 className="text-md  uppercase tracking-wider text-zinc-500 mb-1 ml-2 mt-10 hover:text-white max-w-max select-none">
        Inline full history
      </h2>
      <div className="bg-zinc-800 p-2  rounded-xl ">
        <ul className="flex flex-wrap gap-2">
          {entries.map((day, idx) => {
            const isCurrentMonth = isThisMonth(day.date);
            const entryDate = day.date.getDate();

            if (isCurrentMonth && entryDate > today.getDate()) {
              return null;
            }

            return (
              <li key={idx} className="aspect-square h-10 w-10">
                <button
                  disabled={
                    isCurrentMonth && day.date.getDate() > today.getDate()
                  }
                  aria-label="toggle habit state"
                  onClick={() => toggleHabitDay(day.date)}
                  className={cn(
                    "w-full h-full rounded-md border-2 border-transparent text-white font-semibold transition-colors",
                    {
                      "bg-success": day.state === "completed",
                      "bg-failed": day.state === "failed",
                      "bg-zinc-700":
                        isPast(day.date) &&
                        day.state !== "failed" &&
                        day.state !== "completed",
                    },
                    "disabled:cursor-not-allowed disabled:text-white/30 disabled:bg-transparent",
                    "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20"
                  )}
                >
                  {idx + 1}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HabitEntriesInLineView;
