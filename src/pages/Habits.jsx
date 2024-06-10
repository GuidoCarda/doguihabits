import React, { useEffect, useRef, useState } from "react";

//Components
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import HabitsWeekView from "./components/HabitsWeekView";
import HabitsSorting from "./components/HabitSorting";
import { Button, IconButton, IconTextButton } from "../components/Buttons";
import HabitModal from "./components/HabitModal";

//Hooks
import useKeyPress from "../hooks/useKeyPress";

//Animations
import { AnimatePresence, motion } from "framer-motion";

//Icons
import {
  ArrowLeftOnRectangleIcon,
  BackwardIcon,
  Cog6ToothIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import useDialogStore, { useDialog } from "../store/useDialogStore";
import { useAuth } from "../context/AuthContext";
import { useIsMutating } from "@tanstack/react-query";
import { useHabits } from "../hooks/api/useHabits";
import { useDeleteAllHabits } from "../hooks/api/useDeleteHabit";
import { toast } from "react-hot-toast";
import { cn, isSameDay } from "../utils";
import { HABITS_LIMIT, HABIT_FORM_ACTIONS } from "../constants";
import useMilestoneDialogStore from "../store/useMilestoneDialogStore";
import { Link } from "react-router-dom";
import { useRestartAllHabitProgress } from "../hooks/api/useRestartHabit";

import BarbellIcon from "../assets/icons/barbell.svg?react";
import BookIcon from "../assets/icons/book.svg?react";
import TargetArrowIcon from "../assets/icons/target-arrow.svg?react";

const Habits = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("latest");
  const { handleSignOut } = useAuth();
  const isMilestoneDialogOpen = useMilestoneDialogStore((state) => state.open);

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
  const habitsLimitReached = habitsCount >= HABITS_LIMIT;

  // KeysActions maps to provide the user keyboard shortcuts
  const keysToAction = [
    {
      keys: ["shiftKey", "n"],
      conditionals: [
        !isOpen,
        !habitsLimitReached,
        !isMutating,
        !isMilestoneDialogOpen,
      ],
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
        <AnimatePresence mode="wait">
          {habitsQuery.isPending && (
            <PageLoading message={"Getting your habits..."} />
          )}
        </AnimatePresence>

        <HabitModal
          isOpen={isOpen}
          onClose={handleClose}
          title={"New Habit"}
          action={HABIT_FORM_ACTIONS.create}
        />

        <PageHeader
          habitsLimitReached={habitsLimitReached}
          showHabitModal={handleShowToggle}
          signOut={handleSignOut}
        />

        {!hasHabits && <EmptyState onClick={handleShowToggle} />}

        {habitsCount > 1 && (
          <HabitsSorting
            onClick={handleSortChange}
            sortCriteria={sortCriteria}
          />
        )}

        {hasHabits && (
          <>
            <HabitsGrid habits={habitsQuery.data} />
            <HabitsProgressBar />
          </>
        )}
      </Layout>
    </motion.main>
  );
};

const HabitsProgressBar = () => {
  const habitsQuery = useHabits();
  const habitsCount = habitsQuery.data.length ?? 0;

  const completedHabitsCount = habitsQuery.data
    .map((habit) => {
      const todaysEntry = habit?.entries?.find((entry) => {
        return isSameDay(entry.date, new Date());
      });
      return todaysEntry?.state ?? "pending";
    })
    .filter((state) => state === "completed").length;

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="font-semibold text-2xl">Current State</h2>
        <span className="text-zinc-400">
          {completedHabitsCount}/{habitsCount} habits completed today
        </span>
      </div>
      <div className="h-10 rounded-md overflow-hidden w-full bg-zinc-700">
        <motion.div
          initial={{
            width: `${(completedHabitsCount / habitsCount) * 100 || 0}%`,
          }}
          animate={{
            width: `${(completedHabitsCount / habitsCount) * 100 || 0}%`,
            transition: { ease: "easeInOut", duration: 1 },
          }}
          className={cn(`bg-emerald-600 h-full `)}
        />
      </div>
    </div>
  );
};

const PageHeader = ({ habitsLimitReached, showHabitModal, signOut }) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-3xl font-semibold">My Habits</h1>
      <div className="flex gap-3">
        <IconTextButton
          onClick={showHabitModal}
          text="new habit"
          className="bg-emerald-600 font-bold"
          icon={<PlusIcon className="block h-4 w-4" strokeWidth="3" />}
        />

        <SettingsModal />

        <IconButton onClick={signOut} className={"group bg-zinc-800"}>
          <ArrowLeftOnRectangleIcon
            className=" transition-colors h-5 w-5 text-zinc-300 group-hover:text-zinc-50"
            strokeWidth={2}
          />
        </IconButton>
      </div>
    </div>
  );
};

const HabitsGrid = ({ habits }) => {
  return (
    <motion.div className={cn("flex gap-4 flex-wrap justify-start")}>
      {habits.map((habit) => (
        <HabitsWeekView key={habit.createdAt} habit={habit} />
      ))}
    </motion.div>
  );
};

export const PageLoading = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={"page_loading"}
      className="absolute inset-0 z-10 h-screen w-full grid place-content-center bg-zinc-900"
    >
      <div className="grid grid-flow-col-dense gap-2 mb-6">
        <span className="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_0s_infinite] rounded-md" />
        <span className="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_.25s_infinite] rounded-md" />
        <span className="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_.5s_infinite] rounded-md" />
        <span className="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_.75s_infinite] rounded-md" />
        <span className="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_1s_infinite] rounded-md" />
        <span className="bg-zinc-700 h-10 w-10 animate-[bounce_2s_ease-in-out_1.25s_infinite] rounded-md" />
      </div>
      <h3 className="animate-pulse text-center text-zinc-400">{message}</h3>
    </motion.div>
  );
};

const EmptyState = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5, when: "beforeChildren" },
      }}
      key={"empty_state"}
      className="grid min-h-[calc(100dvh-14rem)] place-content-center justify-items-center gap-4 "
    >
      <div className="p-5 md:p-0 rounded-lg flex gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
          className="h-20 w-20 grid place-content-center bg-zinc-800 rounded-md"
        >
          <BarbellIcon className="h-12 w-12 stroke-1 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
          className="h-20 w-20 relative bottom-8 grid place-content-center bg-zinc-800 rounded-md"
        >
          <TargetArrowIcon className="h-12 w-12 stroke-1 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
          className="h-20 w-20 grid place-content-center bg-zinc-800 rounded-md"
        >
          <BookIcon className="h-12 w-12 stroke-1 text-white" />
        </motion.div>
      </div>
      <h2 className="text-3xl font-semibold mb-2">Start by creating a habit</h2>

      <Button
        onClick={onClick}
        className="bg-emerald-600 font-bold hover:opacity-95 "
      >
        Create an habit
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

  const dialog = useDialog();
  const isDialogOpen = useDialogStore((state) => state.open);
  const habitsQuery = useHabits();

  const hasHabits = habitsQuery?.data?.length > 0;

  const deleteAllHabitsMutation = useDeleteAllHabits();
  const restartAllHabitProgressMutation = useRestartAllHabitProgress();

  const onClose = () => {
    setIsOpen(false);
  };

  const handleRestart = () => {
    const habitsIds = habitsQuery?.data?.map((habit) => habit.id);
    dialog({
      title: "Warning!",
      description:
        "Are you sure you want to restart all habits progress? This action cannot be undone.",
      catchOnCancel: false,
      submitText: "Confirm",
      isPending: restartAllHabitProgressMutation.isPending,
      pendingText: "Restarting...",
      onConfirm: () =>
        restartAllHabitProgressMutation.mutateAsync(habitsIds, {
          onError: (err, variables, context) => {
            toast.error(
              "An error occurred while restarting the habits progress",
              {
                duration: 5000,
              }
            );
          },
          onSuccess: () => {
            toast.success("All habits progress restarted successfuly");
            onClose();
          },
        }),
    });
  };

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
              onClose();
            },
          }
        ),
    });
  };

  // KeysActions maps to provide the user keyboard shortcuts
  const keysToAction = [
    {
      keys: ["Escape"],
      conditionals: [isOpen && !isDialogOpen],
      callback: onClose,
    },
  ];

  useKeyPress(keysToAction);

  const shortcutCatalog = [
    {
      page: "Habits",
      bindings: [
        { keys: ["Shift", "n"], label: "Open new habit Modal" },
        { keys: ["Escape"], label: "Close Modal" },
      ],
    },
    {
      page: "Habit Detail",
      bindings: [
        { keys: ["Shift", "e"], label: "Open edit habit Modal" },
        { keys: ["Shift", "d"], label: "Open delete habit dialog" },
        { keys: ["Escape"], label: "Close Modal" },
        { keys: ["Escape"], label: "Navigate back" },
      ],
    },
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
                <div className="flex flex-col gap-6">
                  {shortcutCatalog.map(({ page, bindings }) => (
                    <div key={`${page}-page-shortcuts`}>
                      <h3 className="text-lg text-zinc-400 mb-2">
                        {page} Page
                      </h3>
                      <div className="space-y-2">
                        {bindings.map(({ keys, label }, idx) => (
                          <Shortcut key={idx} keys={keys} label={label} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl text-white mb-4">Actions</h2>
                <Tooltip
                  label={"You don't have any habits to delete"}
                  className={cn(hasHabits && "group-hover:hidden ")}
                >
                  <div className="flex items-center justify-between ">
                    <p className="text-zinc-400">Remove all habits</p>
                    <IconTextButton
                      aria-label="remove all habits"
                      className=" group rounded-md md:w-40  bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-zinc-300 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:grayscale"
                      onClick={handleDelete}
                      text="delete"
                      disabled={!hasHabits}
                      icon={
                        <TrashIcon
                          className="transition-colors group-hover:text-zinc-50 h-5 w-5"
                          strokeWidth={2}
                        />
                      }
                    />
                  </div>
                </Tooltip>
                <div className="flex items-center justify-between ">
                  <p className="text-zinc-400">Restart all habits progress</p>
                  <IconTextButton
                    aria-label="remove all habits"
                    className=" group rounded-md md:w-40 bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-zinc-300 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:grayscale"
                    onClick={handleRestart}
                    text="restart"
                    disabled={!hasHabits}
                    icon={
                      <BackwardIcon
                        className="transition-colors group-hover:text-zinc-50 h-5 w-5"
                        strokeWidth={2}
                      />
                    }
                  />
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
      <span className="text-zinc-300 ml-auto">{label}</span>
      <div className="border-[1px] border-zinc-800 flex-1" />
      {keys.map((key) => (
        <kbd
          key={`shortcut-key-${key}`}
          className="grid place-content-center px-2 h-6 text-xs rounded-sm bg-zinc-700 text-zinc-400"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
};

export const Tooltip = ({ label, className, children }) => {
  return (
    <div className="relative group">
      {children}
      <span
        className={cn(
          "absolute hidden opacity-0 z-10 origin-bottom-right select-none left-0 text-sm whitespace-nowrap leading-none py-1 shadow-lg  px-2 rounded-md ",
          "bg-zinc-900 border-[1px] border-zinc-700 text-zinc-200",
          "group-hover:opacity-100 group-hover:block",
          "transition-all duration-200 ease-in-out",
          className
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default Habits;
