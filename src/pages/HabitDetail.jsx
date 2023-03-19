import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import useHabitsStore, { useHabitsActions } from "../store/store";
import Habit from "./components/Habit";

const HabitDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const habits = useHabitsStore((state) => state.habits);
  const habit = habits.find((habit) => habit.id === id);
  const { deleteHabit } = useHabitsActions();

  const handleDelete = (habitId) => {
    deleteHabit(habitId);
    navigate("/");
  };

  return (
    <div className="bg-zinc-800 text-neutral-100 min-h-screen">
      <Layout>
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{habit.title}</h1>
          <button
            onClick={() => handleDelete(habit.id)}
            className="h-10 px-4 bg-red-700/10 border-2 border-red-900 text-white font-bold rounded-md"
          >
            Delete Habit
          </button>
        </div>

        <ul className="text-neutral-100 flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          <li key={habit.id}>
            <Habit habit={habit} />
          </li>
          <li key={habit.id}>
            <Habit habit={habit} />
          </li>
          <li key={habit.id}>
            <Habit habit={habit} />
          </li>
          <li key={habit.id}>
            <Habit habit={habit} />
          </li>
        </ul>
      </Layout>
    </div>
  );
};

export default HabitDetail;
