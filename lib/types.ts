// Core type definitions for ServeHub

export type Ministry = 
  | "musician"
  | "usher"
  | "multimedia"
  | "singer"
  | "scripture_reader"
  | "prayer_leader"
  | "host";

export interface Person {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  ministries: Ministry[];
  gender: "male" | "female";
  isActive: boolean;
  isExemptFromAutoSchedule?: boolean; // Don't include in auto-scheduling
  priority?: "high" | "normal" | "low"; // Higher priority = more likely to be assigned
  createdAt: Date;
}

export type ServiceType = "sunday_morning" | "sunday_evening" | "midweek" | "special";

export interface Schedule {
  id: string;
  date: Date;
  serviceType: ServiceType;
  assignments: Assignment[];
  notes?: string;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  scheduleId: string;
  personId: string;
  ministry: Ministry;
  confirmed: boolean;
}

export type SongGenre = 
  | "adoration"
  | "confession"
  | "thanksgiving"
  | "supplication"
  | "christmas"
  | "hymnal"
  | "praise_worship";

export type SongLanguage = "tagalog" | "english";

export interface Song {
  id: string;
  title: string;
  artist?: string;
  genre?: SongGenre;
  language: SongLanguage;
  lyrics: string;
  chords?: string; // Optional chords in ChordPro or plain text format
  key?: string; // Musical key (e.g., "G", "Am", "C")
  tempo?: string; // e.g., "Moderate", "Fast", "Slow"
  lastSang?: Date; // When was this song last used in service
  tags: string[];
  createdAt: Date;
}

export interface Manager {
  id: string;
  email: string;
  name: string;
  churchName: string;
  createdAt: Date;
}

export interface ChurchSettings {
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface ScheduleRules {
  singersPerMonth: number;
  techPerMonth: number;
  scriptureReadersPerMonth: number;
  singersPerService: number;
  minGapDays: number;
  alwaysAssignScriptureReader: boolean;
  alwaysAssignTechPerson: boolean;
  respectExemptions: boolean;
}

export interface LineupRules {
  minSongs: number;
  maxSongs: number;
  slowModerateCount: number;
  fastCount: number;
  requireAdoration: boolean;
  requireThanksgiving: boolean;
  requireConfession: boolean;
  requireSupplication: boolean;
  avoidRecentlyPlayed: boolean;
}
