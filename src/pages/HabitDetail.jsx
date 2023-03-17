import React from "react";
import { useParams } from "react-router-dom";
import useHabitsStore from "../store/store";

const HabitDetail = () => {
  let { id } = useParams();

  console.log(id);
  const habits = useHabitsStore((state) => state.habits);

  const habit = habits.find((habit) => habit.id === id);

  return <div>{habit && <h1>{habit.title}</h1>}</div>;
};

export default HabitDetail;
