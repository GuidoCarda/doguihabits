import React, { useEffect, useRef, useState } from "react";

//Components
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";

//Hooks
import useKeyPress from "../hooks/useKeyPress";

//Animations
import { AnimatePresence, motion } from "framer-motion";

//Icons
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, IconTextButton } from "../components/Buttons";
import { useDialog } from "../store/useDialogStore";
import { toast } from "react-hot-toast";
import HabitForm from "./components/HabitForm";
import { deleteAllHabits, getHabitsWithEntries } from "../services/habits";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getTotal } from "../utils";
import clsx from "clsx";

const sortFunctions = {
  latest: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  completed: (a, b) =>
    getTotal(b.entries, "completed") - getTotal(a.entries, "completed"),
};

const getSortedHabits = (habits, sortCriteria) => {
  if (sortCriteria in sortFunctions) {
    return habits.toSorted(sortFunctions[sortCriteria]);
  }
  return habits;
};

function useHabits(sortCriteria, select) {
  const { user } = useAuth();

  const selectFn = select
    ? select
    : (habits) => getSortedHabits(habits, sortCriteria);

  return useQuery({
    queryKey: ["habits", user.uid],
    queryFn: () => getHabitsWithEntries(user.uid),
    select: selectFn,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useHabit(id) {
  return useHabits(null, (habits) => habits.find((habit) => habit.id === id));
}

const Habits = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("latest");
  const { handleSignOut } = useAuth();

  const habitsQuery = useHabits(sortCriteria);
  const isMutating = Boolean(
    useIsMutating({
      mutationKey: ["habit"],
    })
  );

  const handleClose = () => setIsOpen(false);

  const handleShowToggle = () => {
    setIsOpen((prev) => !prev);

    // block page scroll when modal isOpen
    if (typeof window != "undefined" && window.document && isOpen) {
      document.body.style.overflow = "unset";
    } else if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  const habitsCount = habitsQuery?.data?.length ?? 0;
  const hasHabits = habitsCount > 0;
  const habitsLimitReached = habitsCount >= 5;

  // KeysActions maps to provide the user keyboard shortcuts
  const keysToAction = [
    {
      keys: ["shiftKey", "n"],
      conditionals: [!isOpen, !habitsLimitReached, !isMutating],
      callback: (e) => {
        e.preventDefault();
        handleShowToggle();
      },
    },
    {
      keys: ["Escape"],
      conditionals: [isOpen, !isMutating],
      callback: handleShowToggle,
    },
  ];

  useKeyPress(keysToAction);

  // update sorting criteria when user selects new option
  const handleSortChange = (event) => {
    const id = event.target.id;
    const newSortCriteria = id !== sortCriteria ? id : "latest";
    setSortCriteria(newSortCriteria);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={"habits_page"}
      className=" text-neutral-100 max-h-screen overflow-auto scrollbar-none sm:scrollbar-thin sm:scrollbar-thumb-zinc-500 sm:scrollbar-thumb-rounded-xl"
    >
      <Layout>
        {habitsQuery.isPending && (
          <PageLoading message={"Getting your habits..."} />
        )}
        <PageHeader
          hasHabits={hasHabits}
          habitsLimitReached={habitsLimitReached}
          handleShowToggle={handleShowToggle}
          handleSignOut={handleSignOut}
        />
        {habitsCount > 1 && (
          <HabitsSorting
            onClick={handleSortChange}
            sortCriteria={sortCriteria}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen && (
            <Modal
              key={"new_habit_modal"}
              title="New Habit"
              onClose={handleClose}
            >
              <HabitForm onClose={handleClose} />
            </Modal>
          )}
        </AnimatePresence>
        {hasHabits && <HabitsGrid habits={habitsQuery.data} />}
        {!habitsQuery.isPending && !hasHabits && (
          <EmptyState onClick={handleShowToggle} />
        )}
      </Layout>
    </motion.main>
  );
};

function useDeleteAllHabits() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () =>
      deleteAllHabits(
        queryClient.getQueryData(["habits", user.uid]).map((habit) => habit.id)
      ),

    onError: (err, variables, context) => {
      queryClient.setQueryData(["habits", user.uid], context.previousHabits);
    },
    onSuccess: () => {
      queryClient.setQueryData(["habits", user.uid], []);
    },
  });
}

const PageHeader = ({
  hasHabits,
  habitsLimitReached,
  handleShowToggle,
  handleSignOut,
}) => {
  const dialog = useDialog();

  const deleteAllHabitsMutation = useDeleteAllHabits();

  const handleDelete = () => {
    dialog({
      title: "Warning!",
      description:
        "Are you sure you want to delete all habits? This action cannot be undone.",
      catchOnCancel: false,
      submitText: "Confirm",
      isPending: deleteAllHabitsMutation.isPending,
      pendingText: "Deleting...",
      onConfirm: () =>
        deleteAllHabitsMutation.mutateAsync(
          {},
          {
            onError: (err, variables, context) => {
              toast.error("An error occurred while deleting habits");
            },
            onSuccess: () => {
              toast.success("All habits deleted");
            },
          }
        ),
    });
  };

  return (
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-3xl font-semibold">My Habits</h1>

      {hasHabits && (
        <div className="flex gap-3">
          {!habitsLimitReached && (
            <IconTextButton
              onClick={handleShowToggle}
              text="new habit"
              className="bg-green-600 font-bold"
              icon={<PlusIcon className="block h-4 w-4" strokeWidth="3" />}
            />
          )}
          <IconButton
            aria-label="remove all habits"
            className="group rounded-md bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-zinc-300"
            onClick={handleDelete}
          >
            <TrashIcon
              className="transition-colors group-hover:text-zinc-50 h-5 w-5"
              strokeWidth={2}
            />
          </IconButton>
          <IconButton onClick={handleSignOut} className={"group bg-zinc-800"}>
            <ArrowLeftOnRectangleIcon
              className=" transition-colors h-5 w-5 text-zinc-300 group-hover:text-zinc-50"
              strokeWidth={2}
            />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const HabitsGrid = ({ habits }) => {
  return (
    <motion.div className={clsx("flex gap-4 flex-wrap justify-start")}>
      {habits.map((habit) => (
        <HabitsWeekView key={habit.id} habit={habit} />
      ))}
    </motion.div>
  );
};

export const PageLoading = ({ message }) => {
  return (
    <div className="absolute inset-0 z-10 h-screen w-full grid place-content-center bg-zinc-900">
      <div className="grid grid-flow-col-dense gap-2 mb-6">
        <span class="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_0s_infinite] rounded-md  " />
        <span class="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_.25s_infinite] rounded-md  " />
        <span class="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_.5s_infinite] rounded-md  " />
        <span class="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_.75s_infinite] rounded-md  " />
        <span class="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_1s_infinite] rounded-md  " />
        <span class="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_1.25s_infinite] rounded-md  " />
      </div>
      <h3 className="animate-pulse text-center text-zinc-400">{message}</h3>
    </div>
  );
};

const EmptyState = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className=" mt-32 grid place-content-center justify-items-center gap-4"
    >
      <div className="p-5 md:p-0 rounded-lg">
        <img className="h-full w-full" src="EmptyState.png" alt="" />
      </div>
      <h2 className="text-3xl text-bold">Start by creating a habit</h2>

      <Button
        onClick={onClick}
        className="bg-green-600 font-bold hover:opacity-95 "
      >
        create an habit
      </Button>

      <span className="hidden relative md:flex  items-center gap-1 text-xs text-zinc-500">
        or press{" "}
        <kbd className="grid place-content-center px-2 h-6  rounded-sm bg-zinc-700 text-zinc-400">
          Shift
        </kbd>
        +
        <kbd className="grid place-content-center px-2 h-6  rounded-sm bg-zinc-700 text-zinc-400">
          n
        </kbd>
      </span>
    </motion.div>
  );
};

const SettingsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const shortcuts = [
    { keys: ["Shift", "n"], label: "Open new habit Modal" },
    { keys: ["Escape"], label: "Close Modal" },
  ];

  return (
    <>
      <IconButton
        className="text-slate-200 bg-zinc-800 hover:opacity-95"
        onClick={() => setIsOpen(true)}
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </IconButton>

      <AnimatePresence mode="wait" initial={false}>
        {isOpen && (
          <Modal
            key={"settings_modal"}
            title="Settings"
            onClose={onClose}
            className={"sm:max-w-3xl"}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-xl text-white mb-4">Shortcuts</h2>
                <div className="flex flex-col gap-4">
                  {shortcuts.map(({ keys, label }) => (
                    <Shortcut keys={keys} label={label} />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl text-white mb-4">Actions</h2>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400">Restart all habit progress</p>
                  <Button className="w-32 group rounded-md bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-zinc-300">
                    Restart
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400">Export habits data</p>
                  <Button className="w-32 group rounded-md bg-white/10 border-2 border-white/30 hover:shadow-lg hover:shadow-white/5 text-zinc-300">
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

const Shortcut = ({ keys, label }) => {
  return (
    <div className="flex items-center gap-2">
      {keys.map((key) => (
        <kbd
          key={`shortcut-key-${key}`}
          className="grid place-content-center px-2 h-6 text-xs rounded-sm bg-zinc-700 text-zinc-400"
        >
          {key}
        </kbd>
      ))}
      <span className="text-zinc-400">{label}</span>
    </div>
  );
};

export const Tooltip = ({ label, children }) => {
  return (
    <div className="relative group">
      {children}
      <span
        className={clsx(
          "absolute hidden opacity-0 z-10 origin-bottom-right select-none left-0 text-sm whitespace-nowrap leading-none py-1 shadow-lg  px-2 rounded-md ",
          "bg-zinc-900 border-[1px] border-zinc-700 text-zinc-200",
          "group-hover:opacity-100 group-hover:block",
          "transition-all duration-200 ease-in-out"
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default Habits;
