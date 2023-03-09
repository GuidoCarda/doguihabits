import "./App.css";
import useHabitsStore from "./store/store";

import { shallow } from "zustand/shallow";

function App() {
  const habits = useHabitsStore((state) => state.habits);

  return (
    <main className="min-h-screen bg-zinc-800">
      <section className="max-w-lg px-4 mx-auto py-10">
        <HabitForm />
        <ul className="text-neutral-100 flex flex-col gap-4">
          {Boolean(habits.length) ? (
            habits.map((habit) => {
              console.log(habit);
              return (
                <li key={habit.id}>
                  <Habit habit={habit} />
                </li>
              );
            })
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
  return (
    <div className="bg-zinc-600 px-4 py-6 rounded-md ">
      <h2 className="text-2xl mb-4 font-bold capitalize">{habit.title}</h2>
      <ul className="grid grid-cols-7 gap-2">
        {habit.days.map((_, idx) => (
          <li key={idx} className="h-10 w-10">
            <button className="w-full h-full bg-neutral-300 rounded-md"></button>
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
      <input
        className="h-12 rounded-md"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="h-12 w-min px-6 bg-green-700 text-white font-bold rounded-md"
        onClick={createHabit}
      >
        add
      </button>
    </div>
  );
};

export default App;
