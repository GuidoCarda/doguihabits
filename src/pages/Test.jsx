import { useHabits } from "../store/useHabitsStore";

function Test() {
  const habits = useHabits();

  return (
    <div className="text-slate-100">
      <h1>Test</h1>
      {Boolean(habits.length) &&
        habits.map((habit) => {
          return (
            <div
              key={habit.title}
              className="border-2 border-slate-100 px-2 py-4"
            >
              <h2>{habit.title}</h2>
              <p>{habit.id}</p>
            </div>
          );
        })}
    </div>
  );
}

export default Test;
