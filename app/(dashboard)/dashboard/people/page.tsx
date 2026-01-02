"use client";

import { useState, useEffect } from "react";
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
import { Search, Users as UsersIcon, Plus, UserCheck, Filter } from "lucide-react";
import type { Person, Ministry } from "@/lib/types";
import { MINISTRIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function PeoplePage() {
  const supabase = createClient();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMinistry, setFilterMinistry] = useState<string>("all");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch church and people on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get user's church
      const { data: churches, error: churchesError } = await supabase.rpc("get_my_churches");
      
      if (churchesError) {
        console.error("Error getting churches:", churchesError);
        throw churchesError;
      }
      
      if (!churches || churches.length === 0) {
        console.warn("No churches found for user");
        setLoading(false);
        return;
      }
      
      const currentChurchId = churches[0].church_id;
      setChurchId(currentChurchId);
      
      console.log("Fetching people for church:", currentChurchId);
      
      // Verify user is a member of this church (optional check for debugging)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: memberCheck, error: memberError } = await supabase
          .from("church_members")
          .select("role")
          .eq("church_id", currentChurchId)
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (memberError) {
          console.warn("Could not verify church membership:", memberError);
        } else if (memberCheck) {
          console.log("User is a member with role:", memberCheck.role);
        } else {
          console.warn("User is not a member of this church!");
        }
      }

      // Fetch people
      const { data: peopleData, error } = await supabase
        .from("people")
        .select("*")
        .eq("church_id", currentChurchId)
        .order("name");

      if (error) {
        console.error("Supabase error fetching people:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }
      
      console.log("People fetched successfully:", peopleData?.length || 0);

      setPeople(
        (peopleData || []).map((p) => ({
          ...p,
          isActive: p.is_active,
          isExempt: p.is_exempt,
          createdAt: new Date(p.created_at),
        }))
      );
    } catch (error: any) {
      console.error("Error fetching people:", error);
      const errorMessage = 
        error?.message || 
        error?.details || 
        (error instanceof Error ? error.message : "Unknown error");
      console.error("Full error details:", {
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      toast.error("Failed to load people", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Add new person
  const handleAddPerson = async (data: {
    name: string;
    email?: string;
    phone?: string;
    gender: "male" | "female";
    priority?: "high" | "normal" | "low";
    ministries: Ministry[];
  }) => {
    if (!churchId) return;

    try {
      const { data: newPerson, error } = await supabase
        .from("people")
        .insert({
          church_id: churchId,
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          gender: data.gender,
          priority: data.priority || "normal",
          ministries: data.ministries,
          is_active: true,
          is_exempt: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error adding person:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      // Refresh the list to ensure we have the latest data
      await fetchData();
      
      toast.success("Person added successfully");
    } catch (error: any) {
      console.error("Error adding person:", error);
      const errorMessage = 
        error?.message || 
        error?.details || 
        (error instanceof Error ? error.message : "Unknown error");
      console.error("Full error details:", {
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      toast.error("Failed to add person", { description: errorMessage });
    }
  };

  // Edit person
  const handleEditPerson = async (
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
    try {
      const { error } = await supabase
        .from("people")
        .update({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          gender: data.gender,
          priority: data.priority || "normal",
          ministries: data.ministries,
        })
        .eq("id", id);

      if (error) throw error;

      setPeople(
        people.map((person) =>
          person.id === id ? { ...person, ...data } : person
        )
      );

      toast.success("Person updated successfully");
    } catch (error) {
      console.error("Error updating person:", error);
      toast.error("Failed to update person");
    }
  };

  // Toggle exemption
  const handleToggleExemption = async (id: string) => {
    const person = people.find((p) => p.id === id);
    if (!person) return;

    try {
      const { error } = await supabase
        .from("people")
        .update({ is_exempt: !person.isExempt })
        .eq("id", id);

      if (error) throw error;

      setPeople(
        people.map((p) =>
          p.id === id ? { ...p, isExempt: !p.isExempt } : p
        )
      );

      toast.success(
        person.isExempt ? "Exemption removed" : "Person exempted from auto-scheduling"
      );
    } catch (error) {
      console.error("Error toggling exemption:", error);
      toast.error("Failed to update exemption");
    }
  };

  // Delete person
  const handleDeletePerson = async (id: string) => {
    if (!confirm("Are you sure you want to remove this person?")) return;

    try {
      const { error } = await supabase.from("people").delete().eq("id", id);

      if (error) throw error;

      setPeople(people.filter((person) => person.id !== id));
      toast.success("Person removed successfully");
    } catch (error) {
      console.error("Error deleting person:", error);
      toast.error("Failed to remove person");
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

  const activePeople = people.filter((p) => p.isActive !== false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading people...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">People</h1>
          <p className="text-zinc-400 mt-1">
            Manage your ministry team members
          </p>
        </div>
        <AddPersonDialog onAddPerson={handleAddPerson}>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold shadow-lg shadow-amber-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </AddPersonDialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<UsersIcon className="w-5 h-5" />}
          value={people.length}
          label="Total People"
          color="amber"
        />
        <StatCard
          icon={<UserCheck className="w-5 h-5" />}
          value={activePeople.length}
          label="Active"
          color="emerald"
        />
        <StatCard
          icon={<Filter className="w-5 h-5" />}
          value={filteredPeople.length}
          label="Filtered"
          color="blue"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
          />
        </div>
        <Select value={filterMinistry} onValueChange={setFilterMinistry}>
          <SelectTrigger className="w-full sm:w-[200px] h-11 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Filter by ministry" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
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
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
            <UsersIcon className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No people found</h3>
          <p className="text-sm text-zinc-400 mb-6 text-center max-w-sm">
            {searchQuery || filterMinistry !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first ministry team member"}
          </p>
          {!searchQuery && filterMinistry === "all" && (
            <AddPersonDialog onAddPerson={handleAddPerson}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Person
              </Button>
            </AddPersonDialog>
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

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "amber" | "emerald" | "blue";
}) {
  const colorClasses = {
    amber: "bg-amber-500/10 text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-blue-500/10 text-blue-400",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
