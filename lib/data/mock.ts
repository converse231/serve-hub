// Mock data for development
import { Person, Schedule, Song, Assignment } from "@/lib/types";

export const mockPeople: Person[] = [
  // Singers
  {
    id: "1",
    name: "Rafael Gabriel",
    email: "rafael@example.com",
    phone: "+1234567890",
    ministries: ["singer"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jaymark Magsakay",
    email: "jaymark@example.com",
    phone: "+1234567891",
    ministries: ["singer", "multimedia"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Kite Reyes",
    email: "kite@example.com",
    phone: "+1234567892",
    ministries: ["singer", "musician"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    name: "Erica Mendoza",
    email: "erica@example.com",
    phone: "+1234567893",
    ministries: ["singer"],
    gender: "female",
    isActive: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "5",
    name: "Rainne Cruz",
    email: "rainne@example.com",
    phone: "+1234567894",
    ministries: ["singer"],
    gender: "female",
    isActive: true,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "6",
    name: "Daniel Torres",
    email: "daniel@example.com",
    phone: "+1234567895",
    ministries: ["singer", "multimedia"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "7",
    name: "Leigh Garcia",
    email: "leigh@example.com",
    phone: "+1234567896",
    ministries: ["singer"],
    gender: "female",
    isActive: true,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "8",
    name: "Aikee Ramos",
    email: "aikee@example.com",
    phone: "+1234567897",
    ministries: ["singer"],
    gender: "female",
    isActive: true,
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "9",
    name: "Hannah Flores",
    email: "hannah@example.com",
    phone: "+1234567898",
    ministries: ["singer"],
    gender: "female",
    isActive: true,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "10",
    name: "Sienna Castro",
    email: "sienna@example.com",
    phone: "+1234567899",
    ministries: ["singer"],
    gender: "female",
    isActive: true,
    createdAt: new Date("2024-03-15"),
  },
  // Multimedia Team
  {
    id: "11",
    name: "Tyron Aguilar",
    email: "tyron@example.com",
    phone: "+1234567900",
    ministries: ["multimedia"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "12",
    name: "LJ Bautista",
    email: "lj@example.com",
    phone: "+1234567901",
    ministries: ["multimedia"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-01-12"),
  },
  // Scripture Readers (Males)
  {
    id: "13",
    name: "Marcus Diaz",
    email: "marcus@example.com",
    phone: "+1234567902",
    ministries: ["scripture_reader"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "14",
    name: "David Hernandez",
    email: "david@example.com",
    phone: "+1234567903",
    ministries: ["scripture_reader"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "15",
    name: "Samuel Rivera",
    email: "samuel@example.com",
    phone: "+1234567904",
    ministries: ["scripture_reader"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-02-12"),
  },
  {
    id: "16",
    name: "Joshua Santos",
    email: "joshua@example.com",
    phone: "+1234567905",
    ministries: ["scripture_reader"],
    gender: "male",
    isActive: true,
    createdAt: new Date("2024-02-18"),
  },
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
