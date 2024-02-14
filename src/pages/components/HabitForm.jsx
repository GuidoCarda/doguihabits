import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery";
import clsx from "clsx";
import { Button } from "../../components/Buttons";

//Routing
import { useParams } from "react-router-dom";

//Api
import { createHabit, editHabit } from "../../services/habits";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//Auth
import { useAuth } from "../../context/AuthContext";

function useEditHabit(habitId) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationKey: ["habit", "edit", habitId],
    mutationFn: ({ habitId, data }) => editHabit(habitId, data),
    onMutate: (variables) => {
      const previousHabits = queryClient.getQueryData(["habits", user.uid]);

      queryClient.setQueryData(["habits", user.uid], (oldData) => {
        console.log(oldData);
        return oldData?.map((habit) =>
          habit.id === habitId ? { ...habit, ...variables?.data } : habit
        );
      });

      return () => {
        queryClient.setQueryData(["habits", user.uid], previousHabits);
      };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["habit", habitId], (oldData) => {
        return { ...oldData, ...variables?.data };
      });
      queryClient.invalidateQueries(["habit", habitId]);
    },
    onError: (error, variables, rollback) => {
      rollback();
    },
  });
}

function useCreateHabit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationKey: ["habit", "new"],
    mutationFn: createHabit,
    onMutate: (variables) => {
      const previousHabits = queryClient.getQueryData(["habits", user.uid]);

      queryClient.setQueryData(["habits", user.uid], (oldData) => [
        { ...variables, isCreating: true },
        ...oldData,
      ]);

      return () =>
        queryClient.setQueryData(["habits", user.uid], previousHabits);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["habits", user.uid]);
    },
    onError: (error, context, rollback) => {
      console.error(error);
      rollback();
    },
  });
}

const HabitForm = ({ onClose, isEditing = false, initialValues }) => {
  const [input, setInput] = useState(initialValues?.title ?? "");
  const [description, setDescription] =
    useState(initialValues?.description) ?? "";
  const { id: habitId } = useParams();
  const { user } = useAuth();

  const isMobile = useMediaQuery("(max-width: 638px)");

  const newHabitMutation = useCreateHabit();
  const editHabitMutation = useEditHabit(habitId);

  const handleModalClose = () => {
    onClose();
    setInput("");
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      return toast.error("empty title");
    }
    if (input.trim().length > 30) {
      return toast.error("The title is too long");
    }

    const habitData = { title: input, description };

    if (isEditing && habitId) {
      editHabitMutation.mutate(
        { habitId, data: habitData },
        {
          onSuccess: () => {
            handleModalClose();
            toast.success(`${input} habit updated successfully`, {
              position: isMobile ? "bottom-center" : "bottom-right",
            });
          },
          onError: () => {
            handleModalClose();
            toast.error("Something went wrong updating the habit");
          },
        }
      );
    } else {
      newHabitMutation.mutate(habitData, {
        onSuccess: () => {
          handleModalClose();
          toast.success(`${input} habit created successfully`, {
            position: isMobile ? "bottom-center" : "bottom-right",
          });
        },
      });
    }
  };

  const isInputLengthInvalid = input.length > 30;
  const isPending = newHabitMutation.isPending || editHabitMutation.isPending;
  const pendingMessage = isEditing ? "updating habit" : "creating habit";

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
        />
      </div>

      <Button
        className={clsx(
          "w-max mt-8 ml-auto bg-green-600 text-white font-bold rounded-md",
          "enabled:hover:bg-green-600/90",
          "disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed",
          {
            "animate-pulse duration-200": isPending,
          }
        )}
        disabled={isInputLengthInvalid || isPending}
      >
        {isPending ? pendingMessage : isEditing ? "edit" : "create"}
      </Button>
    </form>
  );
};

export default HabitForm;
