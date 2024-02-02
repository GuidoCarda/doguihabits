import React, { useState } from "react";

//Routing
import { Link, useNavigate, useParams } from "react-router-dom";

//Global state hooks
import useHabitsStore, {
  getHabitStreak,
  useHabit,
  useHabitsActions,
} from "../store/useHabitsStore";
import useDialogStore, { useDialog } from "../store/useDialogStore";

import { useQuery } from "@tanstack/react-query";

//Components
import Layout from "../components/Layout";
import HabitMonthlyView from "./components/HabitMonthlyView";

//Icons
import {
  ArrowLeftCircleIcon,
  CheckIcon,
  FireIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { motion } from "framer-motion";
import useKeyPress from "../hooks/useKeyPress";
import { toast } from "react-hot-toast";
import { IconTextButton } from "../components/Buttons";
import Modal from "../components/Modal";
import HabitForm from "./components/HabitForm";
import { getHabitById, updateHabitEntry } from "../services/habits";
import { getTotal, nextState } from "../utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const HabitDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const dialog = useDialog();
  const isDialogOpen = useDialogStore((state) => state.open);
  const handleDialogClose = useDialogStore((state) => state.handleClose);

  const { deleteHabit, editHabit } = useHabitsActions();

  const completionMilestones = useHabitsStore(
    (state) => state.completionMilestones
  );

  console.log(id);

  const habitQuery = useQuery({
    queryKey: ["habit", id],
    queryFn: () => getHabitById(id),
  });

  const updateHabitEntryMutation = useMutation({
    mutationFn: ({ habitId, dayId, newState }) =>
      updateHabitEntry(habitId, dayId, newState),
    // The onMutate callback allow us to perform an optimistic update on the UI
    onMutate: ({ habitId, dayId, newState }) => {
      console.log(habitId, dayId, newState);
      // Snapshot the current data for rollback on error
      const previousData = queryClient.getQueryData(["habit", id]);

      // Optimistically update the UI
      queryClient.setQueryData(["habit", id], (oldData) => {
        // Update the habit entry state
        const updatedEntries = oldData.entries.map((entry) => {
          if (entry.id === dayId) {
            return { ...entry, state: newState };
          }
          return entry;
        });

        return { ...oldData, entries: updatedEntries };
      });

      // Return a rollback function to be used if the mutation fails
      return () => queryClient.setQueryData(["habit", id], previousData);
    },
    onError: (error, variables, rollback) => {
      // Rollback to the previous data on error
      console.log("error", error);
      rollback();
      // Handle errors as needed
    },
    onSettled: () => {
      // trigger the ['habit',id] query after the mutation is settled
      queryClient.invalidateQueries(["habit", id]);
    },
  });

  const handleEdit = (e) => {
    setIsEditing(true);
    e.preventDefault();
  };

  const handleEditModalClose = () => {
    setIsEditing(false);
  };

  const handleDelete = (habitId) => {
    dialog({
      title: "Warning!",
      description: "Are you sure you want to delete this habit",
      catchOnCancel: false,
      submitText: "Confirm",
    })
      .then(() => {
        deleteHabit(habitId);
        navigate("/");
      })
      .finally(() =>
        toast.success(`${habitQuery.data.title} was successfully deleted`)
      );
  };

  const keysToAction = [
    {
      keys: ["shiftKey", "d"],
      conditionals: [habitQuery.data, !isEditing],
      callback: () => handleDelete(id),
    },
    {
      keys: ["shiftKey", "e"],
      conditionals: [habitQuery.data, !isDialogOpen, !isEditing],
      callback: (e) => {
        //prevent the habit form of getting the 'e' shortcut keypress as input
        e.preventDefault();
        handleEdit(e);
      },
    },
    {
      keys: ["Escape"],
      conditionals: [isDialogOpen, habitQuery.data],
      callback: handleDialogClose,
    },
    {
      keys: ["Escape"],
      conditionals: [isEditing, habitQuery.data],
      callback: handleEditModalClose,
    },
    {
      keys: ["Escape"],
      conditionals: [!isDialogOpen, !isEditing, !habitQuery.isPending],
      callback: () => navigate("/"),
    },
  ];

  useKeyPress(keysToAction);

  const habitInfo = [
    {
      title: "streak",
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

  const toggleHabitDay = (dayId, state) => {
    console.log("toggleHabitDay", dayId, state);
    updateHabitEntryMutation.mutate({
      habitId: id,
      dayId,
      newState: nextState(state),
    });
  };

  if (habitQuery.isPending) {
    return (
      <p className="text-slate-200 animate-pulse duration-200">Loading...</p>
    );
  }

  if (!habitQuery.data) {
    return <HabitNotFound />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={"habit_detail_page"}
      className=" text-neutral-100  max-h-screen overflow-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-zinc-500 md:scrollbar-thumb-rounded-xl"
    >
      <Layout>
        <HabitDetailHeader
          habit={habitQuery.data}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        {isEditing && (
          <Modal onClose={handleEditModalClose} title={"Edit Habit"}>
            <HabitForm
              isEditing={isEditing}
              onClose={handleEditModalClose}
              initialValues={{
                title: habitQuery.data.title,
                description: habitQuery.data.description,
              }}
            />
          </Modal>
        )}

        <div className="mb-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {habitInfo.map((info) => (
            <DashboardDetail key={info.title} {...info} />
          ))}
        </div>

        <HabitMontlyViewGrid
          habit={habitQuery.data}
          toggleHabitDay={toggleHabitDay}
        />

        <div className="mt-10  pb-4">
          <h2 className="text-2xl font-bold mb-6">Milestones</h2>
          <ul className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-full pb-4">
            {completionMilestones.map((milestone) => (
              <li
                key={`${milestone}-days-badge`}
                className={`${
                  !habitQuery.data?.badges.includes(milestone)
                    ? "grayscale"
                    : ""
                } text-center bg-zinc-800 h-24 w-24 rounded-lg  grid content-center transition-color duration-500 flex-shrink-0 `}
              >
                <span className="block text-4xl font-bold text-emerald-500">
                  {milestone}
                </span>
                <span className="block text-zinc-400">days</span>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </motion.main>
  );
};

const HabitDetailHeader = ({ habit, handleDelete, handleEdit }) => {
  const { id, title } = habit;
  return (
    <div className="mb-10 flex items-center">
      <Link to={"/"} aria-label="back to home">
        <ArrowLeftCircleIcon className="h-10 w-10 text-neutral-500 hover:text-neutral-400 transition-colors" />
      </Link>
      <h2 className="text-3xl font-bold ml-4 truncate">{title}</h2>

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
  // Divide the entries array on subarray's of months based on the entry date
  // this implemetation doesn't take into consideration the year of the entry
  // so if the habit is tracked for more than a year the entries will be grouped
  // TODO: take into consideration the year of the entry to group the entries
  const months = habit.entries.reduce((acc, entry) => {
    const month = new Date(entry.date).getMonth();
    acc[month] = acc[month] ? [...acc[month], entry] : [entry];
    return acc;
  }, []);

  return (
    <ul className="text-neutral-100  flex flex-col gap-4 sm:grid md:grid-cols-2 xl:grid-cols-3 ">
      {months.map((month, idx) => (
        <li key={`${habit.id}-${idx}`}>
          <HabitMonthlyView month={month} toggleHabitDay={toggleHabitDay} />
        </li>
      ))}
    </ul>
  );
};

const DashboardDetail = ({ title, data, icon }) => {
  return (
    <div className="p-4 w-full bg-zinc-800  rounded-2xl flex items-center justify-around gap-6 ">
      <div className="text-center -space-y-1">
        <h4 className="font-semibold text-zinc-400">{title}</h4>
        <h2 className="text-3xl font-bold">{data}</h2>
      </div>
      <span className=" grid place-content-center h-20 w-20 rounded-full bg-zinc-900">
        {icon == "FireIcon" && <FireIcon className="h-12 text-red-500" />}
        {icon == "XMarkIcon" && <XMarkIcon className="h-12 text-rose-500" />}
        {icon == "CheckIcon" && <CheckIcon className="h-12 text-green-500" />}
      </span>
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

export default HabitDetail;
