import { Schedule, Assignment } from "../types";

// Helper to create dates relative to today
const getDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Get next Sunday
const getNextSunday = (weeksFromNow: number = 0): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday + weeksFromNow * 7);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
};

export const mockAssignments: Assignment[] = [
  // This Sunday's assignments
  { id: "a1", scheduleId: "s1", personId: "1", ministry: "singer", confirmed: true },
  { id: "a2", scheduleId: "s1", personId: "1", ministry: "musician", confirmed: true },
  { id: "a3", scheduleId: "s1", personId: "2", ministry: "usher", confirmed: true },
  { id: "a4", scheduleId: "s1", personId: "3", ministry: "multimedia", confirmed: false },
  { id: "a5", scheduleId: "s1", personId: "4", ministry: "scripture_reader", confirmed: true },
  { id: "a6", scheduleId: "s1", personId: "5", ministry: "host", confirmed: true },
  
  // Next Sunday's assignments
  { id: "a7", scheduleId: "s2", personId: "5", ministry: "singer", confirmed: false },
  { id: "a8", scheduleId: "s2", personId: "7", ministry: "usher", confirmed: true },
  { id: "a9", scheduleId: "s2", personId: "3", ministry: "multimedia", confirmed: true },
  { id: "a10", scheduleId: "s2", personId: "8", ministry: "scripture_reader", confirmed: false },
  { id: "a11", scheduleId: "s2", personId: "4", ministry: "prayer_leader", confirmed: true },
  
  // Two weeks from now
  { id: "a12", scheduleId: "s3", personId: "1", ministry: "singer", confirmed: false },
  { id: "a13", scheduleId: "s3", personId: "2", ministry: "host", confirmed: false },
  { id: "a14", scheduleId: "s3", personId: "7", ministry: "prayer_leader", confirmed: false },
];

export const mockSchedules: Schedule[] = [
  {
    id: "s1",
    date: getNextSunday(0),
    serviceType: "sunday_morning",
    assignments: mockAssignments.filter((a) => a.scheduleId === "s1"),
    notes: "Communion Sunday",
    createdAt: getDate(-7),
  },
  {
    id: "s2",
    date: getNextSunday(1),
    serviceType: "sunday_morning",
    assignments: mockAssignments.filter((a) => a.scheduleId === "s2"),
    createdAt: getDate(-5),
  },
  {
    id: "s3",
    date: getNextSunday(2),
    serviceType: "sunday_morning",
    assignments: mockAssignments.filter((a) => a.scheduleId === "s3"),
    notes: "Youth Sunday",
    createdAt: getDate(-3),
  },
];
