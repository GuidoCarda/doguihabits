import "./App.css";
import useHabitsStore from "./store";
import { shallow } from "zustand/shallow";

function App() {
  const habits = useHabitsStore((state) => state.habits);
  const createHabit = useHabitsStore((state) => state.createHabit);

  console.log(habits);

  return (
    <main className="min-h-screen bg-neutral-800 text-neutral-50">
      <section className="max-w-lg mx-auto py-10 px-4">
        <h1 className="font-bold text-4xl mb-8">My habits</h1>
        <div className="flex gap-4">
          <Input />
          <button
            className="flex-shrink-0 px-6 font-bold h-12 bg-green-600 text-white   rounded-md"
            onClick={createHabit}
          >
            add
          </button>
        </div>

        <ul className="mt-10">
          {Boolean(habits.length) &&
            habits.map((habit, index) => (
              <li key={index} className="flex flex-wrap gap-2">
                {habit.days.map((day) => (
                  <span className="h-10 w-10 flex flex-col bg-slate-700 rounded-md"></span>
                ))}
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}

const Input = () => {
  const [input, setInput] = useHabitsStore(
    (state) => [state.input, state.setInput],
    shallow
  );

  const handleChange = (e) => setInput(e.target.value);

  return (
    <>
      <input
        className="bg-neutral-600 w-full h-12 px-2 rounded-md outline-none border-none "
        type="text"
        value={input}
        onChange={handleChange}
      />
    </>
  );
};

export default App;
