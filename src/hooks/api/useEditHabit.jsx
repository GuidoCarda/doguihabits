import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { editHabit } from "../../services/habits";

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

export default useEditHabit;
