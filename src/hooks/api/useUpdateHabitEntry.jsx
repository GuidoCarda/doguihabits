import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { getHabitStreak, useHabitsActions } from "../../store/useHabitsStore";
import { addBadges, updateHabitEntry } from "../../services/habits";
import toast from "react-hot-toast";

function useUpdateHabitEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const ongoingMutations = useRef(0);
  const addBadgeMutation = useAddBadge();
  const { checkForNewMilestones } = useHabitsActions();

  return useMutation({
    mutationKey: ["habits", user.uid, "update"],
    mutationFn: ({ habitId, dayId, newState }) =>
      updateHabitEntry(habitId, dayId, newState),
    onMutate: async ({ habitId, dayId, newState }) => {
      await queryClient.cancelQueries(["habits", user.uid]);
      ongoingMutations.current++;
      // Snapshot the current data for rollback on error
      const previousData = queryClient.getQueryData(["habits", user.uid]);

      // Optimistically update the UI
      queryClient.setQueryData(["habits", user.uid], (oldData) => {
        // Update the relevant data optimistically
        const updatedData = oldData.map((habit) => {
          if (habit.id === habitId) {
            return {
              ...habit,
              entries: habit.entries.map((entry) =>
                entry.id === dayId ? { ...entry, state: newState } : entry
              ),
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

  return useMutation({
    mutationKey: ["habits", "addBadge"],
    mutationFn: ({ habitId, newBadges }) => addBadges(habitId, newBadges),
    onMutate: ({ habitId, newBadges }) => {
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
    },
    onSuccess: (data) => {
      const lastReachedMilestone = data.at(data.length > 1 ? -1 : 0);

      toast.success(
        `Congratulations! You reached the ${lastReachedMilestone} days milestone`,
        {
          icon: "🎉",
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["habits", user.uid]);
    },
  });
}

export default useUpdateHabitEntry;
