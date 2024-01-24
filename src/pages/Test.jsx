import { useState, useEffect, useRef } from "react";
import { getHabitsWithEntries } from "../services/habits";

function Test() {
  const [habits, setHabits] = useState([]);
  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (alreadyFetched.current) return;

    getHabitsWithEntries().then((habits) => {
      setHabits(habits);
    });

    return () => {
      alreadyFetched.current = true;
    };
  }, []);

  console.log(habits);

  return (
    <div className="text-slate-100">
      <h1>Test</h1>
      {Boolean(habits.length) &&
        habits.map((habit) => {
          return (
            <div className="border-2 border-slate-100 px-2 py-4">
              <h2>{habit.title}</h2>
              <p>{habit.id}</p>
            </div>
          );
        })}
    </div>
  );
}

export default Test;
