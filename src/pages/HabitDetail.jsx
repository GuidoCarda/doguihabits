import React from "react";
import { useParams } from "react-router-dom";
import useHabitsStore from "../store/store";

const HabitDetail = () => {
  let { id } = useParams();

  const habits = useHabitsStore((state) => state.habits);
  const habit = habits.find((habit) => habit.id === id);

  return (
    <div className="bg-zinc-800 min-h-screen">
      {habit && <h1>{habit.title}</h1>}
    </div>
  );
};

export default HabitDetail;
