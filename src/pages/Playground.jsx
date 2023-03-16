import React from "react";
import Layout from "../components/Layout";
import HabitsWeekView from "./components/HabitsWeekView";

const Playground = () => {
  const habits = [...Array(4).keys()];

  return (
    <div className="bg-zinc-800 min-h-screen">
      <Layout>
        <h1 className="text-4xl text-neutral-100 font-bold mb-10">
          Doguihabits
        </h1>
        <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-3 ">
          {habits.map((habit) => (
            <HabitsWeekView />
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default Playground;
