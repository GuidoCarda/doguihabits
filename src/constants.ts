export const HABIT_MILESTONES = [7, 14, 21, 30, 60, 120, 365] as const;

export const HABIT_FORM_ACTIONS = {
  create: "create",
  edit: "edit",
} as const;

export const HABITS_LIMIT = 5 as const;

export const ENTRY_STATE = {
  pending: "pending",
  completed: "completed",
  failed: "failed",
} as const;
