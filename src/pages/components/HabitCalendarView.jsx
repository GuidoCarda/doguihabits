import { useState } from "react";
import { IconButton } from "../../components/Buttons";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import EntriesCalendar from "./EntriesCalendar";
import useUpdateHabitEntry from "../../hooks/api/useUpdateHabitEntry";
import { useHabit } from "../../hooks/api/useHabits";
import { startOfMonth } from "../../utils";

const HabitCalendarView = ({ habitId }) => {
  const [date, setDate] = useState(startOfMonth(new Date()));

  const habitsQuery = useHabit(habitId);
  const updateEntryMutation = useUpdateHabitEntry();

  const getNextMonthDate = (dirtyDate) => {
    const date = new Date(dirtyDate);
    date.setMonth(date.getMonth() + 1);
    return date;
  };
  const getPrevMonthDate = (dirtyDate) => {
    const date = new Date(dirtyDate);
    date.setMonth(date.getMonth() - 1);
    return date;
  };

  const onNextClick = () => {
    const nextMonth = getNextMonthDate(date);
    setDate(nextMonth);
  };

  const onPrevClick = () => {
    const prevMonth = getPrevMonthDate(date);
    setDate(prevMonth);
  };

  if (habitsQuery.isPending) return <div>Loading...</div>;

  const onDateClick = (date) => {
    updateEntryMutation.mutate({
      habitId: habitId,
      entryDate: date,
      entries: habitsQuery?.data.entries,
    });
  };

  return (
    <div className="max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <IconButton
          onClick={onPrevClick}
          className={
            "text-zinc-400 hover:text-white transition-colors duration-150 "
          }
        >
          <ArrowLeftIcon className="h-5 w-5" strokeWidth={2} />
        </IconButton>
        <IconButton
          onClick={onNextClick}
          className={
            "text-zinc-400 hover:text-white transition-colors duration-150"
          }
        >
          <ArrowRightIcon className="h-5 w-5" strokeWidth={2} />
        </IconButton>
      </div>
      <EntriesCalendar
        date={date}
        entries={habitsQuery?.data.entries}
        onDateClick={onDateClick}
      />
    </div>
  );
};

export default HabitCalendarView;
