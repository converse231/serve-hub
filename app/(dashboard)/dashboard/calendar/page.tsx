"use client";

import { useState } from "react";
import { ScheduleGenerator } from "@/components/schedule/ScheduleGenerator";
import { MonthlyScheduleGenerator } from "@/components/schedule/MonthlyScheduleGenerator";
import { ExemptionManagerDialog } from "@/components/people/ExemptionManagerDialog";
import { CalendarView } from "@/components/calendar/CalendarView";
import { ScheduleDetailDialog } from "@/components/calendar/ScheduleDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileText, Wand2 } from "lucide-react";
import { mockPeople, mockSchedules } from "@/lib/data/mock";
import { format } from "date-fns";
import { SERVICE_TYPES } from "@/lib/constants";
import type { Person, Schedule } from "@/lib/types";

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("view");
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

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
