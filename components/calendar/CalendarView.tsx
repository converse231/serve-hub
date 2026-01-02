"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import type { Schedule } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  schedules: Schedule[];
  onDateClick: (date: Date) => void;
  onScheduleClick: (schedule: Schedule) => void;
}

export function CalendarView({ schedules, onDateClick, onScheduleClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get all days to display (including padding days from prev/next month)
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay());
  
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get schedules for a specific date
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((schedule) => 
      isSameDay(schedule.date, date)
    );
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous month</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next month</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const daySchedules = getSchedulesForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            const hasSchedules = daySchedules.length > 0;

            return (
              <button
                key={index}
                onClick={() => {
                  if (hasSchedules) {
                    onScheduleClick(daySchedules[0]);
                  } else {
                    onDateClick(day);
                  }
                }}
                className={cn(
                  "relative min-h-[80px] md:min-h-[100px] p-2 rounded-lg border-2 transition-all",
                  "hover:border-primary hover:shadow-md",
                  "flex flex-col items-start",
                  !isCurrentMonth && "opacity-40",
                  isCurrentDay && "border-primary bg-primary/5",
                  hasSchedules && "bg-primary/10 border-primary/50",
                  !hasSchedules && "border-border"
                )}
              >
                {/* Date number */}
                <span
                  className={cn(
                    "text-sm font-medium mb-1",
                    isCurrentDay && "text-primary font-bold"
                  )}
                >
                  {format(day, "d")}
                </span>

                {/* Schedule indicators */}
                {hasSchedules && (
                  <div className="w-full space-y-1">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="w-full text-left"
                      >
                        <Badge
                          variant="secondary"
                          className="text-xs w-full justify-start gap-1 truncate"
                        >
                          <Users className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {schedule.assignments.length} assigned
                          </span>
                        </Badge>
                        {schedule.serviceType && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {schedule.serviceType.replace("_", " ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/5" />
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary/50 bg-primary/10" />
            <span className="text-sm text-muted-foreground">Has Schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-border" />
            <span className="text-sm text-muted-foreground">No Schedule</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

