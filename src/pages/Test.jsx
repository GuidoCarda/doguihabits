import { useState } from "react";
import Layout from "../components/Layout";
import { getDayMonthYear, startOfMonth } from "../utils";
import { IconButton } from "../components/Buttons";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useHabits } from "../hooks/api/useHabits";
import useUpdateHabitEntry from "../hooks/api/useUpdateHabitEntry";
import HabitCalendarView from "./components/HabitCalendarView";

const Test = () => {
  const [date, setDate] = useState(startOfMonth(new Date()));

  const habitsQuery = useHabits();
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
    console.log(date, getNextMonthDate(date));
    const nextMonth = getNextMonthDate(date);
    setDate(nextMonth);
  };

  const onPrevClick = () => {
    console.log(date, getPrevMonthDate(date));
    const prevMonth = getPrevMonthDate(date);
    setDate(prevMonth);
  };

  if (habitsQuery.isPending) return <div>Loading...</div>;

  const habit = habitsQuery.data[1];

  const onDateClick = (date) => {
    updateEntryMutation.mutate({
      habitId: habit.id,
      entryDate: date,
      entries: habit.entries,
    });
  };

  return (
    <div>
      <Layout className={"grid"}>
        <h1 className="text-white text-3xl">CalendarView</h1>
        <div className="max-w-md mx-auto mt-10">
          <span className="text-zinc-400 font-medium block mb-2">
            {getDayMonthYear(date).join("-")}
          </span>
          <div className="flex justify-between items-center">
            <IconButton onClick={onPrevClick}>
              <ArrowLeftIcon className="h-5 w-5 text-white" />
            </IconButton>
            <IconButton onClick={onNextClick}>
              <ArrowRightIcon className="h-5 w-5 text-white" />
            </IconButton>
          </div>
          <HabitCalendarView
            date={date}
            entries={habit.entries}
            onDateClick={onDateClick}
          />
        </div>
      </Layout>
    </div>
  );
};

export default Test;
