import { Person } from "../types";

// Helper to create a person with all required fields
const createPerson = (
  id: string,
  name: string,
  email: string | undefined,
  phone: string | undefined,
  ministries: Person["ministries"],
  gender: Person["gender"],
  createdAt: Date,
  isActive: boolean = true,
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
    is_active: isActive,
    is_exempt: isExempt,
    priority,
    created_at: createdDate,
    updated_at: createdDate,
    // Aliases
    isActive,
    isExempt: isExempt,
    isExemptFromAutoSchedule: isExempt,
    createdAt: createdDate,
  };
};

export const mockPeople: Person[] = [
  createPerson(
    "1",
    "Maria Santos",
    "maria.santos@email.com",
    "+63 912 345 6789",
    ["singer", "musician"],
    "female",
    new Date("2024-01-15")
  ),
  createPerson(
    "2",
    "Juan dela Cruz",
    "juan.dc@email.com",
    "+63 923 456 7890",
    ["usher", "host"],
    "male",
    new Date("2024-02-20")
  ),
  createPerson(
    "3",
    "Ana Reyes",
    "ana.reyes@email.com",
    "+63 934 567 8901",
    ["multimedia"],
    "female",
    new Date("2024-03-10")
  ),
  createPerson(
    "4",
    "Pedro Garcia",
    undefined,
    "+63 945 678 9012",
    ["scripture_reader", "prayer_leader"],
    "male",
    new Date("2024-01-05")
  ),
  createPerson(
    "5",
    "Sofia Mendoza",
    "sofia.m@email.com",
    undefined,
    ["singer", "host"],
    "female",
    new Date("2024-04-01")
  ),
  createPerson(
    "6",
    "Miguel Torres",
    "miguel.t@email.com",
    "+63 956 789 0123",
    ["musician", "multimedia"],
    "male",
    new Date("2023-11-20"),
    false // isActive
  ),
  createPerson(
    "7",
    "Grace Lim",
    undefined,
    "+63 967 890 1234",
    ["usher", "prayer_leader"],
    "female",
    new Date("2024-05-15")
  ),
  createPerson(
    "8",
    "David Tan",
    "david.tan@email.com",
    "+63 978 901 2345",
    ["scripture_reader"],
    "male",
    new Date("2024-06-01")
  ),
];
