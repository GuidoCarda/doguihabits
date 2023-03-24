import { shallow } from "zustand/shallow";
import useHabitsStore, { useHabitsActions } from "../../store/useHabitsStore";

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
          className="h-12 rounded-md  bg-zinc-600 text-neutral-200 px-4 outline-none w-full"
          type="text"
          id="habit"
          value={input}
          autoFocus
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

export default HabitForm;
