import { shallow } from "zustand/shallow";
import useHabitsStore, { useHabitsActions } from "../../store/useHabitsStore";
import toast from "react-hot-toast";
import useMediaQuery from "../../hooks/useMediaQuery";
import clsx from "clsx";

const HabitForm = ({ onClose }) => {
  const [input, setInput] = useHabitsStore(
    (state) => [state.input, state.setInput],
    shallow
  );

  const isMobile = useMediaQuery("(max-width: 638px)");

  const { createHabit } = useHabitsActions();

  const onClick = () => {
    if (!input.trim()) {
      return toast.error("empty field", {});
    }
    if (input.trim().length > 30) {
      return toast.error("The title is too long");
    }
    createHabit();
    onClose();
    toast.success(`${input} habit created successfully`, {
      position: isMobile ? "bottom-center" : "bottom-right",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <div className="flex justify-between">
          <label htmlFor="habit" className="text-neutral-400 mb-1 block">
            habit title
          </label>

          <span
            className={clsx(
              `text-sm text-zinc-400 font-semibold mt-1 mr-1 block w-4 text-right`,
              {
                "text-red-400": input.length > 30,
              }
            )}
          >
            {30 - input.length}
          </span>
        </div>

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
        className={clsx(
          "h-12 w-min px-6 mt-6 ml-auto bg-green-600 text-white font-bold rounded-md",
          "disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={input.length > 30}
      >
        add
      </button>
    </div>
  );
};

export default HabitForm;
