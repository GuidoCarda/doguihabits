import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit } from "../../services/habits";
import { useAuth } from "../../context/AuthContext";

function useCreateHabit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationKey: ["habit", "new"],
    mutationFn: createHabit,
    onMutate: async (variables) => {
      //Cancel any outgoing refetches
      await queryClient.cancelQueries(["habits", user.uid]);

      const previousHabits = queryClient.getQueryData(["habits", user.uid]);

      queryClient.setQueryData(["habits", user.uid], (oldData) => [
        { ...variables, isCreating: true },
        ...oldData,
      ]);

      return () =>
        queryClient.setQueryData(["habits", user.uid], previousHabits);
    },
    onError: (error, context, rollback) => {
      console.error(error);
      rollback();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["habits", user.uid]);
    },
  });
}

export default useCreateHabit;
