import "./App.css";
import useHabitsStore from "./store/store";

import { shallow } from "zustand/shallow";

function App() {
  const habits = useHabitsStore((state) => state.habits);

  return (
    <main className="min-h-screen bg-zinc-800">
      <section className="max-w-lg px-4 mx-auto py-10">
        <h1 className="text-3xl mb-4 font-semibold text-neutral-100">
          My Habits
        </h1>
        <HabitForm />
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

  const { getHabit, updateHabit, deleteHabit } = useHabitsStore(
    (state) => ({
      getHabit: state.getHabit,
      deleteHabit: state.deleteHabit,
      updateHabit: state.updateHabit,
    }),
    shallow
  );

  const toggleDayState = (state) => {
    if (state === "pending") return "completed";
    if (state === "completed") return "failed";
    if (state === "failed") return "pending";
  };

  const toggleHabitDay = (habitId, dayId) => {
    const habit = getHabit(habitId);

    const editedHabit = {
      ...habit,
      days: habit.days.map((day) =>
        day.id === dayId ? { ...day, state: toggleDayState(day.state) } : day
      ),
    };

    updateHabit(editedHabit);
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
              } rounded-md `}
            ></button>
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

  const createHabit = useHabitsStore((state) => state.createHabit);

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
        onClick={createHabit}
      >
        add
      </button>
    </div>
  );
};

export default App;
