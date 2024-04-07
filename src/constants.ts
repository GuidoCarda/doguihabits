export const HABIT_MILESTONES = [7, 14, 21, 30, 60, 120, 365] as const;

export const HABIT_MILESTONES_MESSAGES = {
  7: "One week down! You're off to a great start!",
  14: "Two weeks in! Keep up the awesome work!",
  21: "Three weeks strong! You're crushing it!",
  30: "One month complete! Way to go!",
  60: "Two months in! You're unstoppable!",
  120: "Four months down! You're on fire!",
  365: "One year milestone! What an achievement!",
} as const;

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
