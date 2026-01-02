// Mock data for development
import { Person, Schedule, Song, Assignment } from "@/lib/types";

// Helper to create a person with all required fields
const createPerson = (
  id: string,
  name: string,
  email: string,
  phone: string,
  ministries: Person["ministries"],
  gender: Person["gender"],
  createdAt: Date,
  isExempt: boolean = false,
  priority: Person["priority"] = "normal"
): Person => {
  const createdDate = createdAt;
  return {
    id,
    church_id: "mock-church-id",
    name,
    email,
    phone,
    ministries,
    gender,
    is_active: true,
    is_exempt: isExempt,
    priority,
    created_at: createdDate,
    updated_at: createdDate,
    // Aliases
    isActive: true,
    isExempt: isExempt,
    isExemptFromAutoSchedule: isExempt,
    createdAt: createdDate,
  };
};

export const mockPeople: Person[] = [
  // Singers
  createPerson(
    "1",
    "Rafael Gabriel",
    "rafael@example.com",
    "+1234567890",
    ["singer"],
    "male",
    new Date("2024-01-15")
  ),
  createPerson(
    "2",
    "Jaymark Magsakay",
    "jaymark@example.com",
    "+1234567891",
    ["singer", "multimedia"],
    "male",
    new Date("2024-01-20")
  ),
  createPerson(
    "3",
    "Kite Reyes",
    "kite@example.com",
    "+1234567892",
    ["singer", "musician"],
    "male",
    new Date("2024-02-01")
  ),
  createPerson(
    "4",
    "Erica Mendoza",
    "erica@example.com",
    "+1234567893",
    ["singer"],
    "female",
    new Date("2024-02-10")
  ),
  createPerson(
    "5",
    "Rainne Cruz",
    "rainne@example.com",
    "+1234567894",
    ["singer"],
    "female",
    new Date("2024-02-15")
  ),
  createPerson(
    "6",
    "Daniel Torres",
    "daniel@example.com",
    "+1234567895",
    ["singer", "multimedia"],
    "male",
    new Date("2024-02-20")
  ),
  createPerson(
    "7",
    "Leigh Garcia",
    "leigh@example.com",
    "+1234567896",
    ["singer"],
    "female",
    new Date("2024-03-01")
  ),
  createPerson(
    "8",
    "Aikee Ramos",
    "aikee@example.com",
    "+1234567897",
    ["singer"],
    "female",
    new Date("2024-03-05")
  ),
  createPerson(
    "9",
    "Hannah Flores",
    "hannah@example.com",
    "+1234567898",
    ["singer"],
    "female",
    new Date("2024-03-10")
  ),
  createPerson(
    "10",
    "Sienna Castro",
    "sienna@example.com",
    "+1234567899",
    ["singer"],
    "female",
    new Date("2024-03-15")
  ),
  // Multimedia Team
  createPerson(
    "11",
    "Tyron Aguilar",
    "tyron@example.com",
    "+1234567900",
    ["multimedia"],
    "male",
    new Date("2024-01-10")
  ),
  createPerson(
    "12",
    "LJ Bautista",
    "lj@example.com",
    "+1234567901",
    ["multimedia"],
    "male",
    new Date("2024-01-12")
  ),
  // Scripture Readers (Males)
  createPerson(
    "13",
    "Marcus Diaz",
    "marcus@example.com",
    "+1234567902",
    ["scripture_reader"],
    "male",
    new Date("2024-01-25")
  ),
  createPerson(
    "14",
    "David Hernandez",
    "david@example.com",
    "+1234567903",
    ["scripture_reader"],
    "male",
    new Date("2024-02-05")
  ),
  createPerson(
    "15",
    "Samuel Rivera",
    "samuel@example.com",
    "+1234567904",
    ["scripture_reader"],
    "male",
    new Date("2024-02-12")
  ),
  createPerson(
    "16",
    "Joshua Santos",
    "joshua@example.com",
    "+1234567905",
    ["scripture_reader"],
    "male",
    new Date("2024-02-18")
  ),
];

export const mockAssignments: Assignment[] = [
  {
    id: "a1",
    scheduleId: "s1",
    personId: "1",
    ministry: "musician",
    confirmed: true,
  },
  {
    id: "a2",
    scheduleId: "s1",
    personId: "2",
    ministry: "usher",
    confirmed: true,
  },
  {
    id: "a3",
    scheduleId: "s1",
    personId: "3",
    ministry: "prayer_leader",
    confirmed: false,
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: "s1",
    date: new Date("2025-01-05"),
    serviceType: "sunday_morning",
    assignments: mockAssignments,
    notes: "New Year service",
    createdAt: new Date("2024-12-20"),
  },
];

export const mockSongs: Song[] = [
  {
    id: "song1",
    title: "Amazing Grace",
    artist: "John Newton",
    genre: "hymnal",
    language: "english",
    lyrics: `Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see

'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed`,
    chords: `[G]Amazing [G7]grace, how [C]sweet the [G]sound
That [G]saved a [Em]wretch like [D]me
I [G]once was [G7]lost, but [C]now am [G]found
Was [Em]blind, but [G/D]now I [D]see [G]`,
    key: "G",
    tempo: "Moderate",
    lastSang: new Date("2024-11-24"),
    tags: ["classic", "hymn"],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "song2",
    title: "Way Maker",
    artist: "Sinach",
    genre: "praise_worship",
    language: "english",
    lyrics: `You are here, moving in our midst
I worship You, I worship You
You are here, working in this place
I worship You, I worship You

Way maker, miracle worker
Promise keeper, light in the darkness
My God, that is who You are`,
    chords: `[D]You are here, moving in our [A]midst
I [Bm]worship You, I [G]worship You
[D]You are here, working in this [A]place
I [Bm]worship You, I [G]worship You

[D]Way maker, miracle [A]worker
Promise [Bm]keeper, light in the [G]darkness
My [D]God, [A]that is who You [Bm]are [G]`,
    key: "D",
    tempo: "Moderate",
    lastSang: new Date("2024-12-01"),
    tags: ["contemporary", "worship"],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "song3",
    title: "Ikaw Lamang",
    artist: "Victory Worship",
    genre: "adoration",
    language: "tagalog",
    lyrics: `Ikaw lamang ang aking Diyos
Walang iba, walang kapantay
Dakila Ka, Dakilang Hari
Ikaw lamang ang aking Diyos

Ikaw lamang, Ikaw lamang
Ikaw lamang ang aking Diyos
Ikaw lamang, Ikaw lamang
Ikaw lamang ang aking Diyos`,
    chords: `[C]Ikaw lamang ang aking [G]Diyos
[Am]Walang iba, walang [F]kapantay
[C]Dakila Ka, Dakilang [G]Hari
[Am]Ikaw lamang ang aking [F]Diyos

[C]Ikaw lamang, [G]Ikaw lamang
[Am]Ikaw lamang ang aking [F]Diyos`,
    key: "C",
    tempo: "Slow",
    lastSang: new Date("2024-11-17"),
    tags: ["tagalog", "worship"],
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "song4",
    title: "O Come All Ye Faithful",
    artist: "Traditional",
    genre: "christmas",
    language: "english",
    lyrics: `O come, all ye faithful, joyful and triumphant
O come ye, O come ye to Bethlehem
Come and behold Him, born the King of angels

O come, let us adore Him
O come, let us adore Him
O come, let us adore Him
Christ, the Lord`,
    key: "G",
    tempo: "Moderate",
    lastSang: new Date("2023-12-25"),
    tags: ["christmas", "hymn", "traditional"],
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "song5",
    title: "Salamat Hesus",
    artist: "Unknown",
    genre: "thanksgiving",
    language: "tagalog",
    lyrics: `Salamat Hesus sa 'Yong pagmamahal
Salamat Hesus sa buhay na handog
Ikaw ang Liwanag, Ikaw ang Pag-asa
Salamat Hesus, Ikaw ang aking Diyos`,
    key: "G",
    tempo: "Moderate",
    lastSang: new Date("2024-11-28"),
    tags: ["thanksgiving", "tagalog"],
    createdAt: new Date("2024-02-10"),
  },
];

// Helper function to get person by id
export const getPersonById = (id: string): Person | undefined => {
  return mockPeople.find((person) => person.id === id);
};

// Helper function to get upcoming schedules
export const getUpcomingSchedules = (): Schedule[] => {
  const now = new Date();
  return mockSchedules
    .filter((schedule) => schedule.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};
