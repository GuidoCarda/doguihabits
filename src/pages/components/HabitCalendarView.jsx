import { useState } from "react";
import { IconButton } from "../../components/Buttons";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import EntriesCalendar from "./EntriesCalendar";
import useUpdateHabitEntry from "../../hooks/api/useUpdateHabitEntry";
import { useHabit } from "../../hooks/api/useHabits";
import {
  cn,
  getMonthString,
  isPreviousTo,
  isSameMonth,
  startOfMonth,
} from "../../utils";

const HabitCalendarView = ({ habitId, className }) => {
  const [date, setDate] = useState(startOfMonth(new Date()));

  const habitQuery = useHabit(habitId);
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

  if (habitQuery.isPending) return <div>Loading...</div>;

  const onDateClick = (date) => {
    updateEntryMutation.mutate({
      habitId: habitId,
      entryDate: date,
      entries: habitQuery?.data.entries,
    });
  };

  return (
    <div className={cn("max-w-sm", className)}>
      <div className="flex justify-between items-center mb-2">
        <IconButton
          onClick={onPrevClick}
          disabled={isSameMonth(date, habitQuery?.data.createdAt)}
          className={
            "text-zinc-400 hover:text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-25"
          }
        >
          <ArrowLeftIcon className="h-5 w-5" strokeWidth={2} />
        </IconButton>

        <span className="block text-sm py-1 px-2 rounded-md text-zinc-500">
          {getMonthString(date.getMonth())}
          <span className="ml-2">{date.getFullYear()}</span>
        </span>
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
        startingDate={habitQuery?.data.createdAt}
        entries={habitQuery?.data.entries}
        onDateClick={onDateClick}
      />
    </div>
  );
};

export default HabitCalendarView;
