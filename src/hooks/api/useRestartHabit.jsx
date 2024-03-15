import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import {
  restartAllHabitProgress,
  restartHabitProgress,
} from "../../services/habits";

function useRestartHabitProgress(id) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["habits", user.uid, "restart", id],
    mutationFn: restartHabitProgress,
    onMutate: (variables) => {},
    onSuccess: (data, variables, context) => {},
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries(["habit", user.uid]);
    },
  });
}

export function useRestartAllHabitProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restartAllHabitProgress,
    onMutate: (variables) => {
      const previousData = queryClient.getQueryData(["habits", user.uid]);

      queryClient.setQueryData(["habits", user.uid], (old) => {
        return old?.map((habit) => {
          return {
            ...habit,
            entries: [],
            badges: [],
          };
        });
      });

      return () => {
        queryClient.setQueryData(["habits", user.uid], previousData);
      };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["habits", user.uid]);
    },
    onError: (error, variables, rollback) => {
      console.error(error);
      console.log(rollback);
    },
  });
}

export default useRestartHabitProgress;
