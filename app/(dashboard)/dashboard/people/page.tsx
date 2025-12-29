"use client";

import { useState } from "react";
import { PersonCard } from "@/components/people/PersonCard";
import { AddPersonDialog } from "@/components/people/AddPersonDialog";
import { EditPersonDialog } from "@/components/people/EditPersonDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users as UsersIcon } from "lucide-react";
import { mockPeople } from "@/lib/data/mock";
import type { Person, Ministry } from "@/lib/types";
import { MINISTRIES } from "@/lib/constants";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMinistry, setFilterMinistry] = useState<string>("all");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Add new person
  const handleAddPerson = (data: {
    name: string;
    email?: string;
    phone?: string;
    gender: "male" | "female";
    priority?: "high" | "normal" | "low";
    ministries: Ministry[];
  }) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      priority: data.priority,
      ministries: data.ministries,
      isActive: true,
      isExemptFromAutoSchedule: false,
      createdAt: new Date(),
    };

    setPeople([newPerson, ...people]);
  };

  // Edit person
  const handleEditPerson = (
    id: string,
    data: {
      name: string;
      email?: string;
      phone?: string;
      gender: "male" | "female";
      priority?: "high" | "normal" | "low";
      ministries: Ministry[];
    }
  ) => {
    setPeople(
      people.map((person) =>
        person.id === id
          ? { ...person, ...data }
          : person
      )
    );
  };

  // Toggle exemption
  const handleToggleExemption = (id: string) => {
    setPeople(
      people.map((person) =>
        person.id === id
          ? { ...person, isExemptFromAutoSchedule: !person.isExemptFromAutoSchedule }
          : person
      )
    );
  };

  // Delete person
  const handleDeletePerson = (id: string) => {
    if (confirm("Are you sure you want to remove this person?")) {
      setPeople(people.filter((person) => person.id !== id));
    }
  };

  // Open edit dialog
  const handleEditClick = (person: Person) => {
    setEditingPerson(person);
    setEditDialogOpen(true);
  };

  // Filter people
  const filteredPeople = people.filter((person) => {
    const matchesSearch = person.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMinistry =
      filterMinistry === "all" ||
      person.ministries.includes(filterMinistry as Ministry);
    return matchesSearch && matchesMinistry;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">People</h1>
          <p className="text-muted-foreground mt-1">
            Manage your ministry team members
          </p>
        </div>
        <AddPersonDialog onAddPerson={handleAddPerson} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <UsersIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{people.length}</p>
              <p className="text-sm text-muted-foreground">Total People</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <UsersIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {people.filter((p) => p.isActive).length}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <UsersIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredPeople.length}</p>
              <p className="text-sm text-muted-foreground">Filtered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-base"
          />
        </div>
        <Select value={filterMinistry} onValueChange={setFilterMinistry}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by ministry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ministries</SelectItem>
            {MINISTRIES.map((ministry) => (
              <SelectItem key={ministry.value} value={ministry.value}>
                {ministry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* People List */}
      {filteredPeople.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onEdit={handleEditClick}
              onDelete={handleDeletePerson}
              onToggleExemption={handleToggleExemption}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <UsersIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No people found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filterMinistry !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first person"}
          </p>
          {!searchQuery && filterMinistry === "all" && (
            <AddPersonDialog onAddPerson={handleAddPerson} />
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <EditPersonDialog
        person={editingPerson}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditPerson={handleEditPerson}
      />
    </div>
  );
}
