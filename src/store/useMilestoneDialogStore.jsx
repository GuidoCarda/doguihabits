import { create } from "zustand";
import { HABIT_MILESTONES } from "../constants";

const initialState = {
  open: false,
  milestone: HABIT_MILESTONES[0],
};

const useMilestoneDialogStore = create((set) => ({
  open: false,
  milestone: HABIT_MILESTONES[0],
  actions: {
    openDialog: (milestone) => set({ open: true, milestone }),
    closeDialog: () => set(initialState),
  },
}));

export const useMilestoneActions = () =>
  useMilestoneDialogStore((state) => state.actions);

export default useMilestoneDialogStore;
