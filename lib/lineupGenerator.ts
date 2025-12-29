// Song lineup generator for worship services

import type { Song, SongGenre } from "./types";

export interface LineupRules {
  minSongs: number; // Minimum songs in lineup
  maxSongs: number; // Maximum songs in lineup
  requireAdoration: boolean;
  requireThanksgiving: boolean;
  requireConfession: boolean;
  requireSupplication: boolean;
  slowModerateCount: number; // Number of slow/moderate songs
  fastCount: number; // Number of fast songs
  avoidRecentlyPlayed: boolean; // Avoid songs played within last 30 days
}

export const DEFAULT_LINEUP_RULES: LineupRules = {
  minSongs: 4,
  maxSongs: 6,
  requireAdoration: true,
  requireThanksgiving: true,
  requireConfession: true,
  requireSupplication: true,
  slowModerateCount: 2,
  fastCount: 2,
  avoidRecentlyPlayed: true,
};

interface LineupSong {
  song: Song;
  reason: string; // Why this song was selected
}

/**
 * Check if a song was recently played (within last 30 days)
 */
function wasRecentlyPlayed(song: Song): boolean {
  if (!song.lastSang) return false;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return song.lastSang > thirtyDaysAgo;
}

/**
 * Shuffle array
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
 * Generate a balanced song lineup based on rules
 */
export function generateLineup(
  availableSongs: Song[],
  customRules?: Partial<LineupRules>
): LineupSong[] {
  const rules = { ...DEFAULT_LINEUP_RULES, ...customRules };
  const lineup: LineupSong[] = [];
  const usedSongIds = new Set<string>();

  // Filter out recently played songs if rule is enabled
  let candidateSongs = rules.avoidRecentlyPlayed
    ? availableSongs.filter((s) => !wasRecentlyPlayed(s))
    : availableSongs;

  // If filtering removed too many songs, use all songs
  if (candidateSongs.length < rules.minSongs) {
    candidateSongs = availableSongs;
  }

  // Helper to get random song by criteria
  const getRandomSong = (
    genre?: SongGenre,
    tempo?: string,
    exclude?: Set<string>
  ): Song | null => {
    let candidates = candidateSongs.filter(
      (s) => !usedSongIds.has(s.id) && !(exclude?.has(s.id))
    );

    if (genre) {
      candidates = candidates.filter((s) => s.genre === genre);
    }

    if (tempo) {
      if (tempo === "slow_moderate") {
        candidates = candidates.filter(
          (s) => s.tempo === "Slow" || s.tempo === "Moderate"
        );
      } else {
        candidates = candidates.filter((s) => s.tempo === tempo);
      }
    }

    if (candidates.length === 0) return null;

    const shuffled = shuffle(candidates);
    return shuffled[0];
  };

  // 1. Add required genre songs
  if (rules.requireAdoration) {
    const song = getRandomSong("adoration");
    if (song) {
      lineup.push({ song, reason: "Adoration (Required)" });
      usedSongIds.add(song.id);
    }
  }

  if (rules.requireThanksgiving) {
    const song = getRandomSong("thanksgiving");
    if (song) {
      lineup.push({ song, reason: "Thanksgiving (Required)" });
      usedSongIds.add(song.id);
    }
  }

  if (rules.requireConfession) {
    const song = getRandomSong("confession");
    if (song) {
      lineup.push({ song, reason: "Confession (Required)" });
      usedSongIds.add(song.id);
    }
  }

  if (rules.requireSupplication) {
    const song = getRandomSong("supplication");
    if (song) {
      lineup.push({ song, reason: "Supplication (Required)" });
      usedSongIds.add(song.id);
    }
  }

  // 2. Count current tempo distribution
  const currentSlow = lineup.filter(
    (l) => l.song.tempo === "Slow" || l.song.tempo === "Moderate"
  ).length;
  const currentFast = lineup.filter((l) => l.song.tempo === "Fast").length;

  // 3. Add more slow/moderate songs if needed
  let neededSlowModerate = rules.slowModerateCount - currentSlow;
  while (neededSlowModerate > 0 && lineup.length < rules.maxSongs) {
    const song = getRandomSong(undefined, "slow_moderate");
    if (!song) break;
    
    lineup.push({ song, reason: "Tempo Balance (Slow/Moderate)" });
    usedSongIds.add(song.id);
    neededSlowModerate--;
  }

  // 4. Add fast songs if needed
  let neededFast = rules.fastCount - currentFast;
  while (neededFast > 0 && lineup.length < rules.maxSongs) {
    const song = getRandomSong(undefined, "Fast");
    if (!song) break;
    
    lineup.push({ song, reason: "Tempo Balance (Fast)" });
    usedSongIds.add(song.id);
    neededFast--;
  }

  // 5. Fill up to minimum songs if needed
  while (lineup.length < rules.minSongs) {
    const song = getRandomSong();
    if (!song) break;
    
    lineup.push({ song, reason: "Fill to Minimum" });
    usedSongIds.add(song.id);
  }

  // 6. Optimal ordering: Start slow, build energy, end strong
  // Sort by tempo: Slow -> Moderate -> Fast
  const tempoOrder = { Slow: 1, Moderate: 2, Fast: 3 };
  lineup.sort((a, b) => {
    const aOrder = tempoOrder[a.song.tempo as keyof typeof tempoOrder] || 2;
    const bOrder = tempoOrder[b.song.tempo as keyof typeof tempoOrder] || 2;
    return aOrder - bOrder;
  });

  return lineup;
}

/**
 * Format lineup to text for copying
 */
export function formatLineupToText(lineup: LineupSong[], title?: string): string {
  let output = title || "WORSHIP SONG LINEUP";
  output += "\n" + "=".repeat(output.length) + "\n\n";

  lineup.forEach((item, index) => {
    output += `${index + 1}. ${item.song.title}\n`;
    if (item.song.artist) {
      output += `   Artist: ${item.song.artist}\n`;
    }
    output += `   Key: ${item.song.key || "N/A"} | Tempo: ${item.song.tempo || "N/A"}\n`;
    if (item.song.genre) {
      output += `   Type: ${item.song.genre.replace("_", " ")}\n`;
    }
    output += `   Reason: ${item.reason}\n`;
    output += "\n";
  });

  output += "=".repeat(30) + "\n";
  output += "Generated by ServeHub\n";

  return output;
}

