// Analytics utilities

import type { Schedule, Person, Song, Ministry } from "./types";

export interface PersonStats {
  personId: string;
  personName: string;
  totalAssignments: number;
  byMinistry: Record<string, number>;
  lastServed?: Date;
}

export interface MinistryStats {
  ministry: Ministry;
  totalAssignments: number;
  uniquePeople: number;
  averagePerMonth: number;
}

export interface SongStats {
  songId: string;
  songTitle: string;
  artist?: string;
  timesUsed: number;
  lastUsed?: Date;
  genres: string[];
}

/**
 * Calculate who serves most often
 */
export function calculatePersonStats(schedules: Schedule[], people: Person[]): PersonStats[] {
  const stats = new Map<string, PersonStats>();

  // Initialize stats for all people
  people.forEach((person) => {
    stats.set(person.id, {
      personId: person.id,
      personName: person.name,
      totalAssignments: 0,
      byMinistry: {},
    });
  });

  // Count assignments
  schedules.forEach((schedule) => {
    schedule.assignments.forEach((assignment) => {
      const personStats = stats.get(assignment.personId);
      if (personStats) {
        personStats.totalAssignments++;
        personStats.byMinistry[assignment.ministry] = 
          (personStats.byMinistry[assignment.ministry] || 0) + 1;
        
        // Update last served
        if (!personStats.lastServed || schedule.date > personStats.lastServed) {
          personStats.lastServed = schedule.date;
        }
      }
    });
  });

  // Convert to array and sort by total assignments
  return Array.from(stats.values()).sort((a, b) => b.totalAssignments - a.totalAssignments);
}

/**
 * Calculate ministry distribution statistics
 */
export function calculateMinistryStats(schedules: Schedule[]): MinistryStats[] {
  const stats = new Map<Ministry, { count: number; people: Set<string> }>();

  schedules.forEach((schedule) => {
    schedule.assignments.forEach((assignment) => {
      const existing = stats.get(assignment.ministry) || {
        count: 0,
        people: new Set<string>(),
      };
      existing.count++;
      existing.people.add(assignment.personId);
      stats.set(assignment.ministry, existing);
    });
  });

  // Calculate average per month (approximate)
  const months = schedules.length > 0 
    ? Math.ceil((Date.now() - schedules[0].date.getTime()) / (1000 * 60 * 60 * 24 * 30)) || 1
    : 1;

  return Array.from(stats.entries()).map(([ministry, data]) => ({
    ministry,
    totalAssignments: data.count,
    uniquePeople: data.people.size,
    averagePerMonth: data.count / months,
  })).sort((a, b) => b.totalAssignments - a.totalAssignments);
}

/**
 * Calculate song usage statistics
 */
export function calculateSongStats(songs: Song[]): SongStats[] {
  return songs
    .map((song) => ({
      songId: song.id,
      songTitle: song.title,
      artist: song.artist,
      timesUsed: 1, // In real app, would track actual usage
      lastUsed: song.lastSang,
      genres: song.genre ? [song.genre] : [],
    }))
    .sort((a, b) => {
      // Sort by last used (most recent first)
      if (a.lastUsed && b.lastUsed) {
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      }
      if (a.lastUsed) return -1;
      if (b.lastUsed) return 1;
      return 0;
    });
}

/**
 * Get top performers (most assignments)
 */
export function getTopPerformers(stats: PersonStats[], limit: number = 5): PersonStats[] {
  return stats.slice(0, limit);
}

/**
 * Get least active people (for balancing)
 */
export function getLeastActive(stats: PersonStats[], limit: number = 5): PersonStats[] {
  return stats
    .filter((s) => s.totalAssignments > 0)
    .sort((a, b) => a.totalAssignments - b.totalAssignments)
    .slice(0, limit);
}

