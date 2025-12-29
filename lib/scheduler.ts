// Smart scheduling algorithm for ServeHub

import type { Person, Ministry } from "./types";
import { addDays, isSunday, format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export interface WeeklyAssignment {
  date: Date;
  singers: Person[];
  tech: Person | null;
  scriptureReader: Person | null;
}

interface AssignmentTracker {
  personId: string;
  count: number;
  lastAssigned?: Date;
}

export interface SchedulingRules {
  singersPerMonth: number; // How many times a singer can be assigned per month
  techPerMonth: number; // Max times a tech person can be assigned per month
  scriptureReadersPerMonth: number; // Max times a scripture reader can be assigned
  minGapDays: number; // Minimum days between assignments for same person
  singersPerService: number; // How many singers per service (3-4 typical)
  requireScriptureReader: boolean; // Always assign a scripture reader
  requireTech: boolean; // Always assign a tech person
  respectExemptions: boolean; // Honor people's exemption flags
}

const DEFAULT_RULES: SchedulingRules = {
  singersPerMonth: 1,
  techPerMonth: 2,
  scriptureReadersPerMonth: 2,
  minGapDays: 7,
  singersPerService: 4,
  requireScriptureReader: true,
  requireTech: true,
  respectExemptions: true,
};

/**
 * Get all Sundays in a given month
 */
export function getSundaysInMonth(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  
  // Get all days in the month and filter for Sundays
  const allDays = eachDayOfInterval({ start, end });
  return allDays.filter((day) => isSunday(day));
}

/**
 * Check if a person can be assigned based on rules
 */
function canAssign(
  person: Person,
  ministry: Ministry,
  date: Date,
  tracker: AssignmentTracker[],
  rules: SchedulingRules
): boolean {
  const personTracker = tracker.find((t) => t.personId === person.id);
  
  if (!personTracker) return true;

  // Check max assignments per month
  if (ministry === "singer" && personTracker.count >= rules.singersPerMonth) {
    return false;
  }
  
  if (ministry === "multimedia" && personTracker.count >= rules.techPerMonth) {
    return false;
  }

  if (ministry === "scripture_reader" && personTracker.count >= rules.scriptureReadersPerMonth) {
    return false;
  }

  // Check minimum gap between assignments
  if (personTracker.lastAssigned) {
    const daysDiff = Math.floor(
      (date.getTime() - personTracker.lastAssigned.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff < rules.minGapDays) {
      return false;
    }
  }

  return true;
}

/**
 * Update assignment tracker
 */
function updateTracker(
  tracker: AssignmentTracker[],
  personId: string,
  date: Date
): AssignmentTracker[] {
  const existingIndex = tracker.findIndex((t) => t.personId === personId);
  
  if (existingIndex >= 0) {
    const updated = [...tracker];
    updated[existingIndex] = {
      ...updated[existingIndex],
      count: updated[existingIndex].count + 1,
      lastAssigned: date,
    };
    return updated;
  }
  
  return [...tracker, { personId, count: 1, lastAssigned: date }];
}

/**
 * Get available people for a ministry that can be assigned on a specific date
 */
function getAvailablePeople(
  people: Person[],
  ministry: Ministry,
  date: Date,
  tracker: AssignmentTracker[],
  rules: SchedulingRules,
  genderFilter?: "male" | "female"
): Person[] {
  return people
    .filter(
      (person) =>
        person.isActive &&
        person.ministries.includes(ministry) &&
        (!genderFilter || person.gender === genderFilter) &&
        (!rules.respectExemptions || !person.isExemptFromAutoSchedule) &&
        canAssign(person, ministry, date, tracker, rules)
    )
    .sort((a, b) => {
      // Sort by priority: high > normal > low
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || "normal"];
      const bPriority = priorityOrder[b.priority || "normal"];
      return bPriority - aPriority;
    });
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate monthly schedule with smart assignment algorithm
 */
export function generateMonthlySchedule(
  people: Person[],
  year: number,
  month: number,
  customRules?: Partial<SchedulingRules>
): WeeklyAssignment[] {
  const rules = { ...DEFAULT_RULES, ...customRules };
  const sundays = getSundaysInMonth(year, month);
  const schedule: WeeklyAssignment[] = [];
  
  let singerTracker: AssignmentTracker[] = [];
  let techTracker: AssignmentTracker[] = [];
  let scriptureTracker: AssignmentTracker[] = [];

  // Get all available people by ministry
  const allSingers = people.filter(
    (p) =>
      p.isActive &&
      p.ministries.includes("singer") &&
      (!rules.respectExemptions || !p.isExemptFromAutoSchedule)
  );
  const allTech = people.filter(
    (p) =>
      p.isActive &&
      p.ministries.includes("multimedia") &&
      (!rules.respectExemptions || !p.isExemptFromAutoSchedule)
  );
  const allScriptureReaders = people.filter(
    (p) =>
      p.isActive &&
      p.ministries.includes("scripture_reader") &&
      p.gender === "male" &&
      (!rules.respectExemptions || !p.isExemptFromAutoSchedule)
  );

  for (const sunday of sundays) {
    // Assign singers (3-4 per service)
    const availableSingers = getAvailablePeople(
      allSingers,
      "singer",
      sunday,
      singerTracker,
      rules
    );

    const shuffledSingers = shuffle(availableSingers);
    const singersToAssign = shuffledSingers.slice(
      0,
      Math.min(rules.singersPerService, shuffledSingers.length)
    );

    singersToAssign.forEach((singer) => {
      singerTracker = updateTracker(singerTracker, singer.id, sunday);
    });

    // Assign tech person
    let assignedTech: Person | null = null;
    if (rules.requireTech) {
      const availableTech = getAvailablePeople(
        allTech,
        "multimedia",
        sunday,
        techTracker,
        rules
      );

      if (availableTech.length > 0) {
        // Pick the person with least assignments
        const techWithCounts = availableTech.map((person) => ({
          person,
          count: techTracker.find((t) => t.personId === person.id)?.count || 0,
        }));
        
        techWithCounts.sort((a, b) => a.count - b.count);
        assignedTech = techWithCounts[0].person;
        techTracker = updateTracker(techTracker, assignedTech.id, sunday);
      }
    }

    // Assign scripture reader (male only)
    let assignedReader: Person | null = null;
    if (rules.requireScriptureReader) {
      const availableReaders = getAvailablePeople(
        allScriptureReaders,
        "scripture_reader",
        sunday,
        scriptureTracker,
        rules,
        "male"
      );

      if (availableReaders.length > 0) {
        // Pick the person with least assignments
        const readersWithCounts = availableReaders.map((person) => ({
          person,
          count: scriptureTracker.find((t) => t.personId === person.id)?.count || 0,
        }));
        
        readersWithCounts.sort((a, b) => a.count - b.count);
        assignedReader = readersWithCounts[0].person;
        scriptureTracker = updateTracker(scriptureTracker, assignedReader.id, sunday);
      }
    }

    schedule.push({
      date: sunday,
      singers: singersToAssign,
      tech: assignedTech,
      scriptureReader: assignedReader,
    });
  }

  return schedule;
}

/**
 * Format schedule to text (similar to user's format)
 */
export function formatScheduleToText(schedule: WeeklyAssignment[], title?: string): string {
  let output = title || "MUSIC TEAM SCHEDULE";
  output += "\n" + "=".repeat(output.length) + "\n\n";

  schedule.forEach((week) => {
    const dateStr = format(week.date, "MMM d");
    output += `${dateStr}\n`;

    // Singers
    if (week.singers.length > 0) {
      const singerNames = week.singers.map((s) => s.name).join(", ");
      output += `${singerNames}\n`;
    } else {
      output += "No singers assigned\n";
    }

    // Tech person
    if (week.tech) {
      output += `Tech: ${week.tech.name}\n`;
    }

    // Scripture reader
    if (week.scriptureReader) {
      output += `Scripture: ${week.scriptureReader.name}\n`;
    }

    output += "\n";
  });

  return output;
}

