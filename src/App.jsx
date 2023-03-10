import "./App.css";
import useHabitsStore, { useHabitsActions } from "./store/store";

import { shallow } from "zustand/shallow";

function App() {
  const habits = useHabitsStore((state) => state.habits);

  const { sortHabits } = useHabitsActions();

  const handleSort = (e) => {
    const mode = e.target.id;
    sortHabits(mode);
  };

  return (
    <main className="min-h-screen bg-zinc-800">
      <section className="max-w-lg px-4 mx-auto py-10">
        <h1 className="text-3xl mb-4 font-semibold text-neutral-100">
          My Habits
        </h1>
        <HabitForm />

        <div className="my-4  text-neutral-100">
          <span className="block mb-2 font-semibold text-zinc-400">
            sort by{" "}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="older"
              onClick={handleSort}
              className="bg-zinc-500 h-10 px-6 font-semibold rounded-md"
            >
              mas antiguos
            </button>
            <button
              id="newest"
              onClick={handleSort}
              className="bg-zinc-500 h-10 px-6 font-semibold rounded-md"
            >
              mas nuevos
            </button>
            <button
              id="most-completed"
              onClick={handleSort}
              className="bg-zinc-500 h-10 px-6 font-semibold rounded-md"
            >
              más completados
            </button>
          </div>
        </div>
        <ul className="text-neutral-100 flex flex-col gap-4">
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
      </section>
    </main>
  );
}

const Habit = (props) => {
  const { habit } = props;

  const { updateHabit, deleteHabit } = useHabitsActions();

  const toggleHabitDay = (habitId, dayId) => {
    updateHabit(habitId, dayId);
  };

  return (
    <div className="bg-zinc-600 px-6   py-6 rounded-md">
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
              onClick={() => toggleHabitDay(habit.id, idx)}
              className={`w-full h-full ${
                day.state === "completed"
                  ? "bg-emerald-500"
                  : day.state === "failed"
                  ? "bg-red-500"
                  : "bg-neutral-300"
              } rounded-md text-black/40 font-semibold`}
            >
              {idx + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HabitForm = () => {
  const [input, setInput] = useHabitsStore(
    (state) => [state.input, state.setInput],
    shallow
  );

  const { createHabit } = useHabitsActions();

  const onClick = () => {
    if (!input.trim()) return alert("empty field");
    createHabit();
  };

  return (
    <div className="flex gap-2 mb-10">
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
        className="h-12 w-min px-6 self-end bg-green-600 text-white font-bold rounded-md"
        onClick={onClick}
      >
        add
      </button>
    </div>
  );
};

export default App;
