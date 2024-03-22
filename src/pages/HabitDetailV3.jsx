import React, { useState } from "react";

//Routing
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

//Global state hooks
import useDialogStore, { useDialog } from "../store/useDialogStore";

import { useIsMutating } from "@tanstack/react-query";

//Components
import Layout from "../components/Layout";
import HabitMonthlyView from "./components/HabitMonthlyView";
import HabitModal from "./components/HabitModal";

//Icons
import {
  ArrowLeftCircleIcon,
  CheckIcon,
  FireIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  ENTRY_STATE,
  HABIT_FORM_ACTIONS,
  HABIT_MILESTONES,
} from "../constants";

import useKeyPress from "../hooks/useKeyPress";
import useUpdateHabitEntry from "../hooks/api/useUpdateHabitEntry";
import useDeleteHabit from "../hooks/api/useDeleteHabit";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button, IconTextButton } from "../components/Buttons";
import {
  cn,
  getDatesInRange,
  getFirstDayOfMonth,
  getHabitStreak,
  getMonthDatesInRange,
  getTotal,
  isPast,
  isSameDay,
  isThisMonth,
  startOfDay,
} from "../utils";
import { PageLoading } from "./Habits";
import { useHabit } from "../hooks/api/useHabits";
import clsx from "clsx";
import EntriesCalendar from "./components/EntriesCalendar";
import useMilestoneDialogStore from "../store/useMilestoneDialogStore";
import useMediaQuery from "../hooks/useMediaQuery";
import HabitCalendarView from "./components/HabitCalendarView";
import { HeatMapWithSVG } from "./components/HabitEntriesHeatmap";

const HabitDetailV2 = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 638px)");

  const dialog = useDialog();
  const isDialogOpen = useDialogStore((state) => state.open);
  const handleDialogClose = useDialogStore((state) => state.handleClose);
  const isMilestoneDialogOpen = useMilestoneDialogStore((state) => state.open);

  const habitQuery = useHabit(id);
  const updateHabitEntryMutation = useUpdateHabitEntry(id);
  const habitDeleteMutation = useDeleteHabit(id);

  const isMutating = Boolean(
    useIsMutating({
      mutationKey: ["habit"],
    })
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditModalClose = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
      isPending: habitDeleteMutation.isPending,
      pendingText: "Deleting...",
      onConfirm: () => habitDeleteMutation.mutateAsync(id),
    });
  };

  const toggleHabitDay = (entryDate) => {
    updateHabitEntryMutation.mutate(
      {
        habitId: id,
        entryDate,
        entries: habitQuery?.data?.entries,
      },
      {
        onError: () => {
          toast.error("An error occurred while updating the habit entries");
        },
      }
    );
  };

  const keysToAction = [
    {
      keys: ["shiftKey", "d"],
      conditionals: [
        habitQuery.data,
        !isEditing,
        !isMutating,
        !isMilestoneDialogOpen,
      ],
      callback: () => handleDelete(id),
    },
    {
      keys: ["shiftKey", "e"],
      conditionals: [
        habitQuery.data,
        !isDialogOpen,
        !isEditing,
        !isMutating,
        !isMilestoneDialogOpen,
      ],
      callback: (e) => {
        //prevent the habit form of getting the 'e' shortcut keypress as input
        e.preventDefault();
        handleEdit();
      },
    },
    {
      keys: ["Escape"],
      conditionals: [isDialogOpen, habitQuery.data, !isMutating],
      callback: handleDialogClose,
    },
    {
      keys: ["Escape"],
      conditionals: [isEditing, habitQuery.data, !isMutating],
      callback: handleEditModalClose,
    },
    {
      keys: ["Escape"],
      conditionals: [
        !isDialogOpen,
        !isEditing,
        !habitQuery.isPending,
        !isMutating,
        !isMilestoneDialogOpen,
      ],
      callback: () => navigate(-1),
    },
  ];

  useKeyPress(keysToAction);

  const habitInfo = [
    {
      title: "current streak",
      data: habitQuery?.data?.entries
        ? getHabitStreak(habitQuery.data.entries)
        : 0,
      icon: "FireIcon",
    },
    {
      title: "completed",
      data: habitQuery?.data?.entries
        ? getTotal(habitQuery.data.entries, "completed")
        : 0,
      icon: "CheckIcon",
    },
    {
      title: "failed",
      data: habitQuery?.data?.entries
        ? getTotal(habitQuery.data.entries, "failed")
        : 0,
      icon: "XMarkIcon",
    },
  ];

  if (habitQuery.isPending) {
    return <PageLoading message="Getting your habit details" />;
  }

  if (!habitQuery.data) {
    return <Navigate to={"/habits"} />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={"habit_detail_page"}
      className=" text-neutral-100  max-h-screen overflow-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-zinc-500 md:scrollbar-thumb-rounded-xl"
    >
      <Button
        onClick={() => navigate("/habits/" + id)}
        className={
          "absolute top-2 left-2 border-2 text-zinc-400 border-zinc-600"
        }
      >
        See v1
      </Button>
      <Layout>
        <HabitModal
          isOpen={isEditing}
          onClose={handleEditModalClose}
          title={"Edit habit"}
          action={HABIT_FORM_ACTIONS.edit}
          initialValues={{
            title: habitQuery.data.title,
            description: habitQuery.data.description,
          }}
        />
        <HabitDetailHeader
          habit={habitQuery.data}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <div className="mb-4">
          <h3 className="text-3xl font-bold">{habitQuery.data?.title}</h3>
          <p className="text-zinc-400 max-w-[50ch] text-pretty  h-14">
            {habitQuery.data?.description.length > 0
              ? habitQuery.data?.description
              : "No description provided"}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 md:h-[500px] my-10">
          <div className="md:place-self-end md:self-start">
            <HabitCalendarView habitId={id} />
          </div>
          <div className=" space-y-10 w-full md:mt-16">
            {habitInfo.map((info) => (
              <DashboardDetail key={info.title} {...info} />
            ))}
          </div>
        </div>
        {/* {isMobile ? (
          <HabitCalendarView habitId={id} />
        ) : (
          <HabitMontlyViewGrid
            habit={habitQuery.data}
            toggleHabitDay={toggleHabitDay}
          />
        )} */}
        {/* <div className="py-6">
          <h2 className="text-2xl font-bold mb-2">Inline full history </h2>
          <HeatMapWithSVG
            id={id}
            entries={habitQuery.data.entries}
            year={2024}
          />
        </div> */}
        <div className="mt-10  pb-4">
          <h2 className="text-2xl font-bold mb-6">Milestones</h2>
          <ul className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-full pb-4">
            {HABIT_MILESTONES.map((milestone) => (
              <li key={milestone}>
                <MilestoneBadge
                  milestone={milestone}
                  isCompleted={habitQuery.data?.badges?.includes(milestone)}
                />
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </motion.main>
  );
};

export const MilestoneBadge = ({ milestone, isCompleted }) => {
  return (
    <div
      key={`${milestone}-days-badge`}
      className={cn(
        !isCompleted && "grayscale",
        "text-center bg-zinc-800 h-24 w-24 rounded-lg  grid content-center transition-color duration-500 flex-shrink-0"
      )}
    >
      <span className="block text-4xl font-bold text-emerald-500">
        {milestone}
      </span>
      <span className="block text-zinc-400">days</span>
    </div>
  );
};

const HabitEntriesInLineView = () => {
  const today = new Date();
  const { id } = useParams();
  const habitQuery = useHabit(id);

  const updateHabitEntryMutation = useUpdateHabitEntry(id);

  const toggleHabitDay = (entryDate) => {
    updateHabitEntryMutation.mutate({
      habitId: id,
      entryDate,
      entries,
    });
  };

  const createdAt = habitQuery?.data.createdAt;

  const entries = getDatesInRange(getFirstDayOfMonth(createdAt), today).map(
    (date) =>
      habitQuery?.data?.entries?.find((entry) =>
        isSameDay(entry.date, date)
      ) || {
        date,
        state: ENTRY_STATE.pending,
      }
  );

  return (
    <div>
      <h2 className="text-md  uppercase tracking-wider text-zinc-500 mb-1 ml-2 mt-10 hover:text-white max-w-max select-none">
        Inline full history
      </h2>
      <div className="bg-zinc-800 p-2  rounded-xl ">
        <ul className="flex flex-wrap gap-2">
          {entries.map((day, idx) => {
            const isCurrentMonth = isThisMonth(day.date);
            const entryDate = day.date.getDate();

            if (isCurrentMonth && entryDate > today.getDate()) {
              return null;
            }

            return (
              <li key={idx} className="aspect-square h-10 w-10">
                <button
                  disabled={
                    isCurrentMonth && day.date.getDate() > today.getDate()
                  }
                  aria-label="toggle habit state"
                  onClick={() => toggleHabitDay(day.date)}
                  className={clsx(
                    "w-full h-full rounded-md border-2 border-transparent text-white font-semibold transition-colors",
                    {
                      "bg-success": day.state === "completed",
                      "bg-failed": day.state === "failed",
                      "bg-zinc-700":
                        isPast(day.date) &&
                        day.state !== "failed" &&
                        day.state !== "completed",
                    },
                    "disabled:cursor-not-allowed disabled:text-white/30 disabled:bg-transparent",
                    "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20"
                  )}
                >
                  {idx + 1}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const HabitDetailHeader = ({ habit, handleDelete, handleEdit }) => {
  const { id, title } = habit;
  return (
    <div className="mb-10 flex items-center">
      <Link to={-1} aria-label="back to home">
        <ArrowLeftCircleIcon className="h-10 w-10 text-neutral-500 hover:text-neutral-400 transition-colors" />
      </Link>
      <h2 className="text-zinc-500 select-none ml-2 truncate">Return home</h2>

      <IconTextButton
        onClick={() => handleDelete(id)}
        text="Delete Habit"
        icon={<TrashIcon className="block h-4 w-4" />}
        className="ml-auto bg-red-700/10 border-2 border-red-900 hover:shadow-lg hover:shadow-red-900/30 text-white font-bold rounded-md"
      />
      <IconTextButton
        onClick={() => handleEdit(id)}
        text="Edit Habit"
        icon={<PencilIcon className="block h-4 w-4" />}
        className="ml-4 bg-emerald-700/10 border-2 border-emerald-900 hover:shadow-lg hover:shadow-emerald-900/30 text-white font-bold rounded-md"
      />
    </div>
  );
};

const HabitMontlyViewGrid = ({ habit, toggleHabitDay }) => {
  const today = startOfDay(new Date());
  const createdAt = habit.createdAt;

  const months = getMonthDatesInRange(createdAt, today).sort((a, b) => b - a);

  return (
    <>
      <ul className="text-neutral-100  flex flex-col gap-4 sm:grid md:grid-cols-2 xl:grid-cols-3 ">
        {months.map((startingDate, idx) => (
          <li key={`${habit.id}-${idx}`}>
            <EntriesCalendar
              entries={habit.entries}
              date={startingDate}
              onDateClick={toggleHabitDay}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

const DashboardDetail = ({ title, data, icon }) => {
  return (
    <div className="w-full flex items-center  gap-4 mb-4">
      <span className=" grid bg-zinc-800  place-content-center h-14 w-14 rounded-full ">
        {icon == "FireIcon" && <FireIcon className="h-8 text-red-500" />}
        {icon == "XMarkIcon" && <XMarkIcon className="h-8 text-rose-500" />}
        {icon == "CheckIcon" && <CheckIcon className="h-8 text-green-500" />}
      </span>
      <div className="">
        <h2 className="text-4xl font-bold">{data}</h2>
        <h4 className="font-semibold text-zinc-400">{title}</h4>
      </div>
    </div>
  );
};

const HabitNotFound = () => {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="max-w-sm flex flex-col text-center items-center gap-4 ">
        <h2 className="text-3xl font-bold text-zinc-300">
          Something went wrong
        </h2>
        <p className="text-zinc-500">
          It looks like the searched habit habit doesn't exists or something
          went wrong on the loading process
        </p>
        <Link
          to="/"
          className="h-10 text-zinc-800 bg-zinc-200 rounded-md flex items-center px-4 mt-10"
        >
          Return to the home page
        </Link>
      </div>
    </div>
  );
};

export default HabitDetailV2;
