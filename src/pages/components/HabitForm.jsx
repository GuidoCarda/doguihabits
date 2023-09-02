import { useHabitsActions } from "../../store/useHabitsStore";
import toast from "react-hot-toast";
import useMediaQuery from "../../hooks/useMediaQuery";
import clsx from "clsx";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Buttons";
import { useParams } from "react-router-dom";

const HabitForm = ({ onClose, isEditing = false, initialValues }) => {
  const [input, setInput] = useState(initialValues?.title ?? "");
  const [description, setDescription] =
    useState(initialValues?.description) ?? "";
  const { id: habitId } = useParams();
  const isMobile = useMediaQuery("(max-width: 638px)");

  const { createHabit, editHabit } = useHabitsActions();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      return toast.error("empty title", {});
    }
    if (input.trim().length > 30) {
      return toast.error("The title is too long");
    }

    const habitData = { input, description };

    if (isEditing && habitId) {
      editHabit(habitId, habitData);
    } else {
      createHabit(habitData);
    }

    setInput("");
    setDescription("");
    onClose();
    toast.success(
      `${input} habit ${isEditing ? "updated" : "created"} successfully`,
      {
        position: isMobile ? "bottom-center" : "bottom-right",
      }
    );
  };

  const isInputLengthInvalid = input.length > 30;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="relative w-full">
        <div className="flex justify-between">
          <label htmlFor="habit" className="text-neutral-400 mb-1 block">
            habit title
          </label>

          <span
            className={clsx(
              `text-sm font-semibold mt-1 mr-1 block w-4 text-right`,
              isInputLengthInvalid ? "text-red-400" : " text-zinc-400"
            )}
          >
            {30 - input.length}
          </span>
        </div>

        <input
          className="h-12 rounded-md border-2 border-zinc-800 bg-zinc-900 text-neutral-200 px-4 outline-none w-full focus:border-green-500/40"
          type="text"
          id="habit"
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
        />
        <AnimatePresence>
          {isInputLengthInvalid && (
            <motion.span
              animate={{ opacity: 1, x: [-2, 2, 0] }}
              initial={{ opacity: 0 }}
              exit={{ x: -2, opacity: 0, transition: { duration: 0.2 } }}
              className="text-sm text-red-400 block absolute -bottom-6"
            >
              The title is too long
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10">
        <label htmlFor="description" className="text-neutral-400 mb-1 block">
          description
        </label>

        <textarea
          name="description"
          id="description"
          placeholder="Give a short description if wanted"
          className="resize-none h-28 rounded-md border-2 border-zinc-800 bg-zinc-900 text-neutral-200 px-4 py-2 outline-none w-full focus:border-green-500/40"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <Button
        className={clsx(
          "w-max mt-8 ml-auto bg-green-600 text-white font-bold rounded-md",
          "enabled:hover:bg-green-600/90",
          "disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed"
        )}
        disabled={isInputLengthInvalid}
      >
        {isEditing ? "edit habit" : "create habit"}
      </Button>
    </form>
  );
};

export default HabitForm;
