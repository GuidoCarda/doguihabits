import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery";
import clsx from "clsx";
import { Button } from "../../components/Buttons";

//Routing
import { useParams } from "react-router-dom";

//Api
import useCreateHabit from "../../hooks/api/useCreateHabit";
import useEditHabit from "../../hooks/api/useEditHabit";
import { HABIT_FORM_ACTIONS } from "../../constants";
import { cn } from "../../utils";

const HabitForm = ({ onClose, action, formValues, handleInputChange }) => {
  const { title, description, isStrictMode } = formValues;

  const { id: habitId } = useParams();

  const isMobile = useMediaQuery("(max-width: 638px)");

  const newHabitMutation = useCreateHabit();
  const editHabitMutation = useEditHabit(habitId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return toast.error("empty title");
    }
    if (title.trim().length > 30) {
      return toast.error("The title is too long");
    }

    const habitData = { title, description: description?.trim(), isStrictMode };

    if (action === HABIT_FORM_ACTIONS.edit && habitId) {
      editHabitMutation.mutate(
        { habitId, data: habitData },
        {
          onSuccess: () => {
            onClose();
            toast.success(`${title} habit updated successfully`, {
              position: isMobile ? "bottom-center" : "bottom-right",
            });
          },
          onError: () => {
            onClose();
            toast.error("Something went wrong updating the habit");
          },
        }
      );
    } else {
      newHabitMutation.mutate(habitData, {
        onSuccess: () => {
          onClose();
          toast.success(`${title} habit created successfully`, {
            position: isMobile ? "bottom-center" : "bottom-right",
          });
        },
      });
    }
  };

  console.log("isStrictMode", isStrictMode);

  const isTitleLengthInvalid = title.length > 30;
  const isDescriptionLengthInvalid = description.length > 100;
  const isPending = newHabitMutation.isPending || editHabitMutation.isPending;
  const pendingMessage =
    action === HABIT_FORM_ACTIONS.edit ? "updating habit" : "creating habit";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="relative w-full">
        <div className="flex justify-between">
          <label htmlFor="habit" className="text-neutral-400 mb-1 block">
            title
          </label>

          <span
            className={clsx(
              `text-sm font-semibold mt-1  tabular-nums block `,
              isTitleLengthInvalid ? "text-red-400" : " text-zinc-400"
            )}
          >
            {30 - title.length}
          </span>
        </div>

        <input
          className="h-12 rounded-md border-2 border-zinc-800 bg-zinc-900 text-neutral-200 px-4 outline-none w-full focus:border-emerald-800"
          type="text"
          id="habit"
          value={title}
          autoFocus
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <AnimatePresence>
          {isTitleLengthInvalid && (
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

      <div className="relative mt-10">
        <div className="flex justify-between">
          <label htmlFor="habit" className="text-neutral-400 mb-1 block">
            description
          </label>

          <span
            className={clsx(
              `text-sm font-semibold mt-1  tabular-nums block `,
              isDescriptionLengthInvalid ? "text-red-400" : " text-zinc-400"
            )}
          >
            {100 - description.length}
          </span>
        </div>

        <textarea
          name="description"
          id="description"
          placeholder="Give a short description if wanted"
          className="resize-none h-28 rounded-md border-2 border-zinc-800 bg-zinc-900 text-neutral-200 px-4 py-2 outline-none w-full focus:border-emerald-800"
          value={description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />

        <AnimatePresence>
          {isDescriptionLengthInvalid && (
            <motion.span
              animate={{ opacity: 1, x: [-2, 2, 0] }}
              initial={{ opacity: 0 }}
              exit={{ x: -2, opacity: 0, transition: { duration: 0.2 } }}
              className="text-sm text-red-400 block absolute -bottom-6"
            >
              The description is too long
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Toggle
        isOn={isStrictMode}
        setIsOn={() => handleInputChange("isStrictMode", !isStrictMode)}
        className={"mt-6"}
      />

      <Button
        className={clsx(
          "w-max mt-8 ml-auto bg-emerald-600 text-white font-bold rounded-md",
          "enabled:hover:bg-emerald-600/80",
          "disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed",
          {
            "animate-pulse duration-200": isPending,
          }
        )}
        disabled={
          isTitleLengthInvalid || isDescriptionLengthInvalid || isPending
        }
      >
        {isPending
          ? pendingMessage
          : action === HABIT_FORM_ACTIONS.edit
          ? "update"
          : "create"}
      </Button>
    </form>
  );
};

const Toggle = ({ isOn, setIsOn, className }) => {
  return (
    <div
      className={cn(
        "group cursor-pointer select-none flex text-zinc-200 justify-between items-center",
        className
      )}
      onClick={() => setIsOn((prev) => !prev)}
    >
      <div>
        <p>Strict Mode</p>
        <p className="text-sm text-zinc-400">
          Track habits from the creation date, moving foward.
        </p>
      </div>

      <div
        className={cn(
          "w-10 p-[2px] rounded-full flex items-center cursor-pointer bg-zinc-800 border border-white/5 group-hover:border-white/10 transition-colors duration-200",
          isOn ? "justify-end" : "justify-start"
        )}
      >
        <motion.span
          layout
          className={cn(
            `h-4 w-4 rounded-full block bg-zinc-500 transition-colors duration-150 ${
              isOn ? "bg-emerald-600" : "justify-self-end"
            }`
          )}
        ></motion.span>
      </div>
    </div>
  );
};

export default HabitForm;
