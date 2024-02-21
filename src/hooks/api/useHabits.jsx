import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { getTotal } from "../../utils";
import { getHabitsWithEntries } from "../../services/habits";

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

export function useHabits(sortCriteria, select) {
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
