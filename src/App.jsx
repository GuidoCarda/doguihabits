import "./App.css";
import useHabitsStore, { useHabitsActions } from "./store/store";

import ReactDOM from "react-dom";

import { shallow } from "zustand/shallow";
import { useMemo, useState } from "react";
import Layout from "./components/Layout";

function App() {
  const [showHabitForm, setShowHabitForm] = useState(false);

  const habits = useHabitsStore((state) => state.habits);

  const { sortHabits } = useHabitsActions();

  const handleSort = (e) => {
    const mode = e.target.id;
    sortHabits(mode);
  };

  const handleShowToggle = () => {
    setShowHabitForm((prev) => !prev);

    if (typeof window != "undefined" && window.document && showHabitForm) {
      document.body.style.overflow = "unset";
    } else if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  return (
    <main className="min-h-screen bg-zinc-800">
      <Layout>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold text-neutral-100">My Habits</h1>

          <button
            onClick={handleShowToggle}
            className="h-12 w-min px-6 bg-green-600 text-white font-bold rounded-md"
          >
            {showHabitForm ? "close" : "new"}
          </button>
        </div>

        {showHabitForm && <Modal onClose={handleShowToggle} />}
        {/* {showHabitForm && <HabitForm handleClose={handleShowToggle} />} */}

        {habits.length > 1 && <HabitsSorting handleSort={handleSort} />}

        <ul className="text-neutral-100 flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          {Boolean(habits.length) ? (
            habits.map((habit) => (
              <li key={habit.id}>
                <Habit habit={habit} />
              </li>
            ))
          ) : (
            <h1>No creaste un habito!</h1>
          )}
        </ul>
      </Layout>
    </main>
  );
}

const Habit = (props) => {
  const { habit } = props;

  const { updateHabit, deleteHabit } = useHabitsActions();

  const toggleHabitDay = (habitId, dayId) => {
    updateHabit(habitId, dayId);
  };

  const currentDate = new Date().getDate();

  return (
    <div className="bg-zinc-600 px-6 py-6 rounded-md ">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl  font-bold capitalize">{habit.title}</h2>
        <button
          className="h-8 w-8 grid place-content-center bg-zinc-400 rounded-md"
          onClick={() => deleteHabit(habit.id)}
        >
          X
        </button>
      </header>

      <ul className="grid grid-cols-7 gap-2">
        {habit.days.map((day, idx) => (
          <li key={idx} className="h-10 w-10">
            <button
              disabled={idx + 1 > currentDate}
              onClick={() => toggleHabitDay(habit.id, idx)}
              className={`w-full h-full ${
                day.state === "completed"
                  ? "bg-emerald-500"
                  : day.state === "failed"
                  ? "bg-red-500"
                  : "bg-neutral-300"
              } rounded-md text-black/40 font-semibold disabled:bg-zinc-500`}
            >
              {idx + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HabitForm = ({ onClose }) => {
  const [input, setInput] = useHabitsStore(
    (state) => [state.input, state.setInput],
    shallow
  );

  const { createHabit } = useHabitsActions();

  const onClick = () => {
    if (!input.trim()) return alert("empty field");
    createHabit();
    onClose();
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <label htmlFor="habit" className="text-neutral-400 mb-1 block">
          habit title
        </label>
        <input
          className="h-12 rounded-md  bg-zinc-700 text-neutral-200 px-4 outline-none w-full"
          type="text"
          id="habit"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button
        className="h-12 w-min px-6 mt-6 ml-auto bg-green-600 text-white font-bold rounded-md"
        onClick={onClick}
      >
        add
      </button>
    </div>
  );
};

const HabitsSorting = ({ handleSort }) => {
  const sortModes = useMemo(() => [
    { mode: "older", label: "más antiguos" },
    { mode: "newest", label: "más nuevos" },
    { mode: "most-completed", label: "más completados" },
  ]);

  return (
    <div className="my-4  text-neutral-100">
      <span className="block mb-2 font-semibold text-zinc-400">sort by </span>

      <div className="flex flex-wrap items-center gap-2">
        {sortModes.map(({ mode, label }) => (
          <button
            id={mode}
            key={mode}
            onClick={handleSort}
            className="bg-zinc-500 h-10 px-6 font-semibold rounded-md"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Modal = ({ onClose }) => {
  return ReactDOM.createPortal(
    <>
      <div className="fixed grid place-items-center top-0 left-0 right-0 bottom-0 h-screen w-full bg-black/50 backdrop-blur-[2px] px-4">
        <div className=" bg-zinc-600 rounded-md px-6 py-10 w-full sm:max-w-md overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-md">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-neutral-300 font-semibold">
              New Habit
            </h2>
            <button
              className="h-8 w-8 rounded-md bg-zinc-400 font-bold text-black/50"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <HabitForm onClose={onClose} />
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default App;
