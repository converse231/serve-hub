// Conflict detection utilities

import type { Schedule, Assignment } from "./types";

export interface ScheduleConflict {
  type: "double_assignment" | "same_day_multiple";
  date: Date;
  personId: string;
  personName: string;
  scheduleIds: string[];
  ministries: string[];
  severity: "high" | "medium" | "low";
}

/**
 * Detect if a person is assigned multiple times in the same schedule
 */
export function detectDoubleAssignments(schedule: Schedule): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const personAssignments = new Map<string, string[]>();

  // Group assignments by person
  schedule.assignments.forEach((assignment) => {
    const existing = personAssignments.get(assignment.personId) || [];
    existing.push(assignment.ministry);
    personAssignments.set(assignment.personId, existing);
  });

  // Find people with multiple assignments
  personAssignments.forEach((ministries, personId) => {
    if (ministries.length > 1) {
      conflicts.push({
        type: "double_assignment",
        date: schedule.date,
        personId,
        personName: "", // Will be filled by caller
        scheduleIds: [schedule.id],
        ministries,
        severity: "high",
      });
    }
  });

  return conflicts;
}

/**
 * Detect if a person is assigned to multiple schedules on the same day
 */
export function detectSameDayConflicts(schedules: Schedule[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  
  // Group schedules by date
  const schedulesByDate = new Map<string, Schedule[]>();
  
  schedules.forEach((schedule) => {
    const dateKey = schedule.date.toDateString();
    const existing = schedulesByDate.get(dateKey) || [];
    existing.push(schedule);
    schedulesByDate.set(dateKey, existing);
  });

  // Check each date with multiple schedules
  schedulesByDate.forEach((daySchedules, dateKey) => {
    if (daySchedules.length > 1) {
      // Track person assignments across schedules
      const personSchedules = new Map<string, { scheduleIds: string[], ministries: string[] }>();

      daySchedules.forEach((schedule) => {
        schedule.assignments.forEach((assignment) => {
          const existing = personSchedules.get(assignment.personId) || {
            scheduleIds: [],
            ministries: [],
          };
          existing.scheduleIds.push(schedule.id);
          existing.ministries.push(assignment.ministry);
          personSchedules.set(assignment.personId, existing);
        });
      });

      // Find people in multiple schedules
      personSchedules.forEach((data, personId) => {
        if (data.scheduleIds.length > 1) {
          conflicts.push({
            type: "same_day_multiple",
            date: daySchedules[0].date,
            personId,
            personName: "", // Will be filled by caller
            scheduleIds: data.scheduleIds,
            ministries: data.ministries,
            severity: "medium",
          });
        }
      });
    }
  });

  return conflicts;
}

/**
 * Get all conflicts for a list of schedules
 */
export function getAllConflicts(schedules: Schedule[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  // Check for double assignments within each schedule
  schedules.forEach((schedule) => {
    conflicts.push(...detectDoubleAssignments(schedule));
  });

  // Check for same-day conflicts across schedules
  conflicts.push(...detectSameDayConflicts(schedules));

  return conflicts;
}

