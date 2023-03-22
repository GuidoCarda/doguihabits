import React from "react";

//Routing
import { Link, useNavigate, useParams } from "react-router-dom";

//Global state
import useHabitsStore, { useHabitsActions } from "../store/useHabitsStore";

//Components
import Layout from "../components/Layout";
import HabitMonthlyView from "./components/HabitMonthlyView";

//Icons
import { ArrowLeftCircleIcon, FireIcon } from "@heroicons/react/24/outline";
import { useDialog } from "../store/useDialogStore";

const HabitDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const habits = useHabitsStore((state) => state.habits);
  const habit = habits.find((habit) => habit.id === id);
  const dialog = useDialog();
  const { deleteHabit } = useHabitsActions();

  const handleDelete = (habitId) => {
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
    }).then(() => {
      deleteHabit(habitId);
      navigate("/");
    });
  };

  const habitInfo = [
    { title: "streak", data: "12d" },
    { title: "completed", data: "32d" },
    { title: "failed", data: "5d" },
  ];

  return (
    <div className=" text-neutral-100 h-screen overflow-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-xl">
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

        {/* <div className=" p-4 mb-6 flex gap-4 rounded-lg bg-zinc-600">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-zinc-300">Created on</h2>
            <span className="block font-bold text-2xl">01-03-23</span>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-zinc-300">Streak</h2>
            <span className="block font-bold text-2xl">12 Days</span>
          </div>
        </div> */}

        <div className="mb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habitInfo.map((info) => (
            <DashboardDetail {...info} />
          ))}
        </div>

        <ul className="text-neutral-100  flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 ">
          {[...Array(1).keys()].map((elem, idx) => (
            <li key={`${habit.id}-${idx}`}>
              <HabitMonthlyView habit={habit} />
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  );
};

const DashboardDetail = ({ title, data }) => {
  return (
    <div className="p-4 w-full bg-zinc-600  rounded-2xl flex items-center justify-around gap-6 ">
      <div className="text-center -space-y-1">
        <h4 className="font-semibold text-zinc-400">{title}</h4>
        <h2 className="text-3xl font-bold">{data}</h2>
      </div>
      <span className=" grid place-content-center h-20 w-20 rounded-full bg-zinc-700">
        <FireIcon className="h-12 text-rose-500 " />
      </span>
    </div>
  );
};

export default HabitDetail;
