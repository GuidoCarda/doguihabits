import React from "react";

//Routing
import { Link, useNavigate, useParams } from "react-router-dom";

//Global state
import useHabitsStore, { useHabitsActions } from "../store/store";

//Components
import Layout from "../components/Layout";
import HabitMonthlyView from "./components/HabitMonthlyView";

//Icons
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

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
    <div className=" text-neutral-100 min-h-screen">
      <Layout>
        <div className="mb-10 flex items-center">
          <Link to={"/"}>
            {" "}
            <ArrowLeftCircleIcon className="h-10 w-10 text-neutral-500" />{" "}
          </Link>
          <h2 className="text-3xl font-bold ml-4">{habit.title}</h2>
          <button
            onClick={() => handleDelete(habit.id)}
            className="h-10 px-4 ml-auto bg-red-700/10 border-2 border-red-900 text-white font-bold rounded-md"
          >
            Delete Habit
          </button>
        </div>

        <ul className="text-neutral-100 flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 ">
          {[...Array(10).keys()].map((elem, idx) => (
            <li key={`${habit.id}-${idx}`}>
              <HabitMonthlyView habit={habit} />
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  );
};

export default HabitDetail;