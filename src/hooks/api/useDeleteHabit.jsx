import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllHabits, deleteHabit } from "../../services/habits";
import { useAuth } from "../../context/AuthContext";

function useDeleteHabit(id) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationKey: ["habits", user.uid, "delete", id],
    mutationFn: deleteHabit,
    onMutate: async (habitId) => {
      await queryClient.cancelQueries(["habits", user.uid]);

      // Snapshot the previous value
      const previousHabits = queryClient.getQueryData(["habits", user.uid]);

      queryClient.setQueryData(["habits", user.uid], (oldData) =>
        oldData?.map((habit) =>
          habit.id === habitId ? { ...habit, isDeleting: true } : habit
        )
      );

      // Return a rollback function
      return () =>
        queryClient.setQueryData(["habits", user.uid], previousHabits);
    },
    onError: (error, variables, rollback) => {
      console.error(error);
      // Rollback to the previous value
      rollback();
    },
    onSuccess: () => {
      queryClient.setQueryData(["habits", user.uid], (oldData) =>
        oldData?.filter((habit) => habit.id !== id)
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["habits", user.uid]);
    },
  });
}

export function useDeleteAllHabits() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => {
      const habitsIds = queryClient
        .getQueryData(["habits", user.uid])
        .map((habit) => habit.id);

      return deleteAllHabits(habitsIds);
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["habits", user.uid], context.previousHabits);
    },
    onSuccess: () => {
      queryClient.setQueryData(["habits", user.uid], []);
    },
  });
}

export default useDeleteHabit;
