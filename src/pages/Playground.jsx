import React from "react";
import Layout from "../components/Layout";
import HabitsWeekView from "./components/HabitsWeekView";

const Playground = () => {
  return (
    <div className="bg-zinc-800 min-h-screen">
      <Layout>
        <h1 className="text-4xl text-neutral-100 font-bold mb-10">
          Doguihabits
        </h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <HabitsWeekView />
        </div>
      </Layout>
    </div>
  );
};

export default Playground;
