import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { addBadges, addEntry, updateHabitEntry } from "../../services/habits";
import toast from "react-hot-toast";
import {
  checkForNewMilestones,
  getHabitStreak,
  isSameDay,
  nextState,
} from "../../utils";
import { ENTRY_STATE } from "../../constants";
import { useMilestoneActions } from "../../store/useMilestoneDialogStore";

function useUpdateHabitEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const ongoingMutations = useRef(0);
  const addBadgeMutation = useAddBadge();

  return useMutation({
    mutationKey: ["habits", user.uid, "update"],
    mutationFn: ({ habitId, entryDate, entries }) => {
      const entry = entries.find((entry) => isSameDay(entry.date, entryDate));
      if (entries.length === 0 || !entry) {
        return addEntry(habitId, {
          date: entryDate,
          state: ENTRY_STATE.completed,
        });
      }

      updateHabitEntry(habitId, entryDate, entries);
    },
    onMutate: async ({ habitId, entryDate, entries }) => {
      await queryClient.cancelQueries(["habits", user.uid]);
      ongoingMutations.current++;
      // Snapshot the current data for rollback on error
      const previousData = queryClient.getQueryData(["habits", user.uid]);

      // Optimistically update the UI
      queryClient.setQueryData(["habits", user.uid], (oldData) => {
        // Update the relevant data optimistically
        const updatedData = oldData?.map((habit) => {
          if (habit.id === habitId) {
            const entry = entries.find((entry) =>
              isSameDay(entry.date, entryDate)
            );
            if (entry) {
              return {
                ...habit,
                entries: entries.map((entry) =>
                  isSameDay(entry.date, entryDate)
                    ? { ...entry, state: nextState(entry.state) }
                    : entry
                ),
              };
            }

            return {
              ...habit,
              entries: habit?.entries?.concat({
                date: entryDate,
                state: nextState("pending"),
              }),
            };
          }
          return habit;
        });

        return updatedData;
      });

      // Return a rollback function
      return () => {
        // Rollback to the previous habits data
        queryClient.setQueryData(["habits", user.uid], previousData);
      };
    },
    onError: (error, variables, rollback) => {
      ongoingMutations.current = 0;
      // Rollback to the previous data on error
      queryClient.invalidateQueries(["habits", user.uid]);
    },
    // Optional: Provide an onSettled function for cleanup or additional actions
    onSuccess: async (data, variables, context) => {
      ongoingMutations.current--;

      const habitData = queryClient
        .getQueryData(["habits", user.uid])
        ?.find((habit) => habit.id === variables.habitId);

      const newBadges = checkForNewMilestones(
        getHabitStreak(habitData?.entries),
        habitData?.badges
      );

      if (newBadges) {
        await addBadgeMutation.mutateAsync({
          habitId: variables.habitId,
          newBadges,
        });
      }
    },
  });
}

export function useAddBadge() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { openDialog: openMilestoneDialog } = useMilestoneActions();

  return useMutation({
    mutationKey: ["habits", "addBadge"],
    mutationFn: ({ habitId, newBadges }) => addBadges(habitId, newBadges),
    onMutate: ({ habitId, newBadges }) => {
      queryClient.cancelQueries(["habits", user.uid]);
      queryClient.setQueryData(["habits", user.uid], (oldData) => {
        return oldData.map((habit) => {
          if (habit.id === habitId) {
            return { ...habit, badges: habit?.badges?.concat(newBadges) };
          }
          return habit;
        });
      });
    },
    onError: (error, variables, rollback) => {
      console.error(error);
      queryClient.invalidateQueries(["habits", user.uid]);
    },
    onSuccess: (data) => {
      const lastReachedMilestone = data.at(data.length > 1 ? -1 : 0);

      openMilestoneDialog(lastReachedMilestone);
    },
    onSettled: () => {
      // queryClient.invalidateQueries(["habits", user.uid]);
    },
  });
}

export default useUpdateHabitEntry;
