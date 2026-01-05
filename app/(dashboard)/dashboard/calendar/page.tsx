"use client";

import { useState, useEffect } from "react";
import { ScheduleGenerator } from "@/components/schedule/ScheduleGenerator";
import { MonthlyScheduleGenerator } from "@/components/schedule/MonthlyScheduleGenerator";
import { ExemptionManagerDialog } from "@/components/people/ExemptionManagerDialog";
import { CalendarView } from "@/components/calendar/CalendarView";
import { ScheduleDetailDialog } from "@/components/calendar/ScheduleDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileText, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { SERVICE_TYPES } from "@/lib/constants";
import type { Person, Schedule } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function CalendarPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("view");
  const [people, setPeople] = useState<Person[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState<string | null>(null);

  // Fetch data on mount
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

      // Fetch people and schedules in parallel
      const [peopleRes, schedulesRes] = await Promise.all([
        supabase
          .from("people")
          .select("*")
          .eq("church_id", currentChurchId)
          .order("name"),
        supabase
          .from("schedules")
          .select(
            `
            *,
            assignments (
              id,
              schedule_id,
              person_id,
              ministry,
              confirmed
            )
          `
          )
          .eq("church_id", currentChurchId)
          .order("date", { ascending: true })
      ]);

      if (peopleRes.error) {
        console.error("Error fetching people:", peopleRes.error);
        throw peopleRes.error;
      }

      if (schedulesRes.error) {
        console.error("Error fetching schedules:", schedulesRes.error);
        throw schedulesRes.error;
      }

      // Transform people data
      const transformedPeople = (peopleRes.data || []).map((p) => ({
        ...p,
        isActive: p.is_active,
        isExempt: p.is_exempt,
        isExemptFromAutoSchedule: p.is_exempt,
        createdAt: new Date(p.created_at),
      })) as Person[];

      // Transform schedules data
      const transformedSchedules = (schedulesRes.data || []).map((s) => ({
        id: s.id,
        date: new Date(s.date),
        serviceType: s.service_type as Schedule["serviceType"],
        notes: s.notes || undefined,
        createdAt: new Date(s.created_at),
        assignments: (s.assignments || []).map((a: any) => ({
          id: a.id,
          scheduleId: a.schedule_id,
          personId: a.person_id,
          ministry: a.ministry,
          confirmed: a.confirmed,
        })),
      })) as Schedule[];

      setPeople(transformedPeople);
      setSchedules(transformedSchedules);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      const errorMessage = 
        error?.message || 
        error?.details || 
        (error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to load data", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Toggle exemption
  const handleToggleExemption = async (id: string) => {
    const person = people.find((p) => p.id === id);
    if (!person || !churchId) return;

    try {
      const newExemptValue = !(person.isExemptFromAutoSchedule ?? false);
      
      const { error } = await supabase
        .from("people")
        .update({ is_exempt: newExemptValue })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setPeople(
        people.map((p) =>
          p.id === id
            ? { ...p, isExempt: newExemptValue, isExemptFromAutoSchedule: newExemptValue }
            : p
        )
      );

      toast.success(
        newExemptValue ? "Person exempted from auto-scheduling" : "Exemption removed"
      );
    } catch (error: any) {
      console.error("Error toggling exemption:", error);
      const errorMessage = 
        error?.message || 
        error?.details || 
        (error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to update exemption", { description: errorMessage });
    }
  };

  // Handle date click (empty date)
  const handleDateClick = (date: Date) => {
    // TODO: Could open create schedule dialog here
    console.log("Date clicked:", date);
  };

  // Handle schedule click (date with schedule)
  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setScheduleDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Calendar & Schedules</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage service schedules
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="view" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="auto" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Auto Schedule
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <FileText className="w-4 h-4" />
            Manual
          </TabsTrigger>
        </TabsList>

        {/* Calendar View Tab */}
        <TabsContent value="view" className="space-y-6">
          <CalendarView 
            schedules={schedules}
            onDateClick={handleDateClick}
            onScheduleClick={handleScheduleClick}
          />
        </TabsContent>

        {/* Auto Schedule Tab */}
        <TabsContent value="auto" className="space-y-6">
          <MonthlyScheduleGenerator 
            people={people} 
            onToggleExemption={handleToggleExemption}
          />
        </TabsContent>

        {/* Manual Create Schedule Tab */}
        <TabsContent value="create" className="space-y-6">
          <ScheduleGenerator people={people} />
        </TabsContent>
      </Tabs>

      {/* Schedule Detail Dialog */}
      <ScheduleDetailDialog
        schedule={selectedSchedule}
        people={people}
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
      />
    </div>
  );
}
