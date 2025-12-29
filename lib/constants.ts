// Constants for the application

import type { Ministry } from "./types";

export const MINISTRIES: { value: Ministry; label: string; description: string }[] = [
  {
    value: "musician",
    label: "Musician",
    description: "Plays instruments during worship",
  },
  {
    value: "singer",
    label: "Singer",
    description: "Leads or supports worship singing",
  },
  {
    value: "usher",
    label: "Usher",
    description: "Welcomes and assists congregation",
  },
  {
    value: "multimedia",
    label: "Multimedia",
    description: "Manages presentations and technical aspects",
  },
  {
    value: "scripture_reader",
    label: "Scripture Reader",
    description: "Reads Bible passages during service",
  },
  {
    value: "prayer_leader",
    label: "Prayer Leader",
    description: "Leads congregation in prayer",
  },
  {
    value: "host",
    label: "Host/MC",
    description: "Hosts and guides the service flow",
  },
];

export const SERVICE_TYPES = [
  { value: "sunday_morning", label: "Sunday Morning Service" },
  { value: "sunday_evening", label: "Sunday Evening Service" },
  { value: "midweek", label: "Midweek Service" },
  { value: "special", label: "Special Service" },
] as const;

export const SONG_GENRES = [
  { value: "adoration", label: "Adoration" },
  { value: "confession", label: "Confession" },
  { value: "thanksgiving", label: "Thanksgiving" },
  { value: "supplication", label: "Supplication" },
  { value: "christmas", label: "Christmas" },
  { value: "hymnal", label: "Hymnal" },
  { value: "praise_worship", label: "Praise & Worship" },
] as const;

export const SONG_LANGUAGES = [
  { value: "english", label: "English" },
  { value: "tagalog", label: "Tagalog" },
] as const;

